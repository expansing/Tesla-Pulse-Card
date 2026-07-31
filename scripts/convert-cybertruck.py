import bpy
import os
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


def enhance_headlights():
    """Make headlight materials visible and emissive for web rendering."""
    headlight_keywords = ("light", "lamp", "head", "glow", "indicator", "fog")
    
    for object_ in bpy.context.scene.objects:
        name = object_.name.lower()
        if object_.type != "MESH" or not any(kw in name for kw in headlight_keywords):
            continue
        
        for slot in object_.material_slots:
            material = slot.material
            if material is None:
                continue
            
            # Make visible
            material.blend_method = "BLEND"
            material.shadow_method = "NONE"
            material.use_backface_culling = False
            
            # Add emission for glow effect
            if hasattr(material, "use_nodes") and material.use_nodes:
                material.node_tree.nodes.new(type="ShaderNodeEmission")
                if material.node_tree.nodes.get("Emission"):
                    emission = material.node_tree.nodes.get("Emission")
                    emission.inputs[0].default_value = (1.0, 1.0, 1.0, 1.0)  # White emission
                    emission.inputs[1].default_value = 1.5  # Strength
            else:
                material.emit = 0.8
                material.use_transparent_shadows = True


def cleanup_mesh_geometry():
    """Remove degenerate geometry and ensure manifold meshes."""
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH":
            continue

        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)

        # Enter edit mode and cleanup
        bpy.ops.object.mode_set(mode="EDIT")
        bpy.ops.mesh.select_all(action="SELECT")

        # Remove degenerate geometry
        bpy.ops.mesh.delete_loose()
        bpy.ops.mesh.dissolve_degenerate()

        # Ensure consistent normals
        bpy.ops.mesh.normals_make_consistent(inside=False)

        bpy.ops.object.mode_set(mode="OBJECT")
        obj.select_set(False)


def remove_duplicate_wheels():
    """Detect and remove duplicate wheel meshes that are too close together."""
    wheel_keywords = ("wheel", "hub", "tire", "tyre", "rim", "ban")
    
    wheel_meshes = []
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH":
            continue
        name_lower = obj.name.lower()
        if any(kw in name_lower for kw in wheel_keywords):
            wheel_meshes.append(obj)
    
    if len(wheel_meshes) <= 4:
        return  # Expected 4 wheels, no duplicates
    
    # Sort by spatial position to detect clusters
    from math import sqrt
    
    def obj_center(obj):
        if obj.data.vertices:
            xs = [v.co.x for v in obj.data.vertices]
            ys = [v.co.y for v in obj.data.vertices]
            zs = [v.co.z for v in obj.data.vertices]
            return (sum(xs) / len(xs), sum(ys) / len(ys), sum(zs) / len(zs))
        return obj.location[:]
    
    def dist(p1, p2):
        return sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2 + (p1[2] - p2[2])**2)
    
    marked_for_removal = set()
    
    # For each wheel, check if there's another wheel very close to it
    for i, wheel in enumerate(wheel_meshes):
        if i in marked_for_removal:
            continue
        
        center_i = obj_center(wheel)
        
        for j, other_wheel in enumerate(wheel_meshes):
            if i >= j or j in marked_for_removal:
                continue
            
            center_j = obj_center(other_wheel)
            
            # If centers are within 0.5 units, likely a duplicate
            if dist(center_i, center_j) < 0.5:
                # Keep the one with more geometry
                verts_i = len(wheel.data.vertices)
                verts_j = len(other_wheel.data.vertices)
                to_remove = j if verts_i >= verts_j else i
                marked_for_removal.add(to_remove)
    
    # Remove marked wheels
    for idx in sorted(marked_for_removal, reverse=True):
        obj_to_remove = wheel_meshes[idx]
        bpy.data.objects.remove(obj_to_remove, do_unlink=True)



def repair_missing_left_wheels():
    """Clone right-side tire meshes when FBX only binds tires to right dummies."""

    def _has_wheel_mesh_child(dummy):
        for child in dummy.children:
            if child.type == "MESH" and "wheel" in child.name.lower():
                return True
        return False

    source_parent = bpy.data.objects.get("wheel_rf_dummy")
    if source_parent is None:
        return

    front_target = bpy.data.objects.get("wheel_lf_dummy")
    rear_target = bpy.data.objects.get("wheel_lb_dummy")
    if front_target is None or rear_target is None:
        return

    front_source = bpy.data.objects.get("wheels")
    rear_source = bpy.data.objects.get("wheels.001")

    if front_source is not None and not _has_wheel_mesh_child(front_target):
        clone = front_source.copy()
        clone.data = front_source.data.copy()
        clone.name = "wheels_lf_fixed"
        bpy.context.scene.collection.objects.link(clone)
        clone.parent = front_target
        clone.matrix_parent_inverse = front_target.matrix_world.inverted()
        clone.location = front_source.location.copy()
        clone.rotation_euler = front_source.rotation_euler.copy()
        clone.scale = front_source.scale.copy()

    if rear_source is not None and not _has_wheel_mesh_child(rear_target):
        clone = rear_source.copy()
        clone.data = rear_source.data.copy()
        clone.name = "wheels_lb_fixed"
        bpy.context.scene.collection.objects.link(clone)
        clone.parent = rear_target
        clone.matrix_parent_inverse = rear_target.matrix_world.inverted()
        clone.location = rear_source.location.copy()
        clone.rotation_euler = rear_source.rotation_euler.copy()
        clone.scale = rear_source.scale.copy()


def main():
    source_fbx, output_glb = sys.argv[sys.argv.index("--") + 1:]

    patch_non_color_fallback()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.fbx(filepath=source_fbx, use_image_search=True)
    cleanup_mesh_geometry()
    remove_duplicate_wheels()
    repair_missing_left_wheels()
    normalize_wheel_materials()
    enhance_headlights()

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