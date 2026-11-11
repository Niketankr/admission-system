import zipfile
import os

base_dir = os.path.dirname(os.path.abspath(__file__))
zip_path = os.path.join(base_dir, 'admission-system-submission.zip')

exclude_dirs = {'node_modules', '.git', '.cache'}
exclude_files = {'.env', 'admission-system-submission.zip'}

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(base_dir):
        # prune excluded directories in-place
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for f in files:
            if f in exclude_files or f.endswith('.zip'):
                continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, base_dir)
            zipf.write(full_path, os.path.join('admission-system', rel_path))

size_kb = os.path.getsize(zip_path) / 1024
print(f'Archive created: {zip_path} ({size_kb:.1f} KB)')

