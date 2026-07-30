import bpy
import os
import sys


def main():
    source_fbx, output_glb = sys.argv[sys.argv.index("--") + 1:]

    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.fbx(filepath=source_fbx, use_image_search=True)

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