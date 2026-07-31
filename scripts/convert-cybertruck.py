import bpy
import os
import shutil
import sys
import bpy_extras.node_shader_utils as node_shader_utils


def patch_non_color_fallback():
    """Gracefully map missing Non-Color colorspace assignments to Linear."""

    def safe_image_set(self, image):
        if self.colorspace_is_data is not ...:
            if image.colorspace_settings.is_data != self.colorspace_is_data and image.users >= 1:
                image = image.copy()
            image.colorspace_settings.is_data = self.colorspace_is_data
        if self.colorspace_name is not ...:
            if image.colorspace_settings.name != self.colorspace_name and image.users >= 1:
                image = image.copy()
            try:
                image.colorspace_settings.name = self.colorspace_name
            except TypeError:
                image.colorspace_settings.name = "Linear"
        if self.use_alpha:
            tree = self.owner_shader.material.node_tree
            if image.channels < 4 or image.depth in {24, 8}:
                tree.links.new(self.node_image.outputs["Color"], self.socket_dst)
            else:
                tree.links.new(self.node_image.outputs["Alpha"], self.socket_dst)
        self.node_image.image = image

    node_shader_utils.ShaderImageTextureWrapper.image_set = node_shader_utils._set_check(safe_image_set)
    node_shader_utils.ShaderImageTextureWrapper.image = property(
        node_shader_utils.ShaderImageTextureWrapper.image_get,
        node_shader_utils.ShaderImageTextureWrapper.image_set,
    )


def normalize_wheel_materials():
    """Force wheel-like parts to opaque shading for stable web rendering."""
    wheel_keywords = (
        "wheel",
        "hub",
        "tire",
        "rim",
        "ban",
    )

    for object_ in bpy.context.scene.objects:
        name = object_.name.lower()
        if object_.type != "MESH" or not any(keyword in name for keyword in wheel_keywords):
            continue

        for slot in object_.material_slots:
            material = slot.material
            if material is None:
                continue

            material.blend_method = "OPAQUE"
            material.shadow_method = "OPAQUE"
            material.use_backface_culling = True


def cleanup_mesh_geometry():
    """Remove degenerate geometry and ensure manifold meshes."""
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH":
            continue

        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.mode_set(mode="EDIT")
        bpy.ops.mesh.select_all(action="SELECT")
        bpy.ops.mesh.delete_loose()
        bpy.ops.mesh.dissolve_degenerate()
        bpy.ops.mesh.normals_make_consistent(inside=False)
        bpy.ops.object.mode_set(mode="OBJECT")
        obj.select_set(False)


def restore_referenced_light_texture(source_fbx):
    """Provide the texture filename referenced by the FBX light materials."""
    texture_directory = os.path.splitext(source_fbx)[0] + ".fbm"
    referenced_texture = os.path.join(texture_directory, "vehiclelights.PNG")
    supplied_texture = os.path.join(texture_directory, "vehiclelights128.png")

    if not os.path.exists(referenced_texture) and os.path.exists(supplied_texture):
        shutil.copyfile(supplied_texture, referenced_texture)


def main():
    source_fbx, output_glb = sys.argv[sys.argv.index("--") + 1:]

    patch_non_color_fallback()
    restore_referenced_light_texture(source_fbx)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.fbx(filepath=source_fbx, use_image_search=True)
    cleanup_mesh_geometry()
    normalize_wheel_materials()

    for image in bpy.data.images:
        if image.source == "FILE" and image.filepath:
            image.filepath = bpy.path.abspath(image.filepath, library=None)
            image.filepath_raw = image.filepath

    for object_ in bpy.context.scene.objects:
        object_.select_set(True)

    bpy.ops.export_scene.gltf(
        filepath=output_glb,
        export_format="GLB",
        export_image_format="AUTO",
        export_materials="EXPORT",
        export_yup=True,
        export_apply=True,
        export_normals=True,
        export_tangents=True,
        export_cameras=False,
        export_lights=False,
    )


if __name__ == "__main__":
    main()