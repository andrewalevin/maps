import pathlib
from PIL import Image


def resize(path, size=100, allowed_extensions=None):
    if allowed_extensions is None:
        allowed_extensions = ['.png', '.jpg', '.jpeg']
    path = pathlib.Path(path)
    files = list(filter(lambda f: f.suffix in allowed_extensions and not f.stem.endswith(f'-{size}'), path.iterdir()))
    for file in files:
        thumbnail = file.with_stem(f'{file.stem}-{size}')
        if thumbnail.exists():
            continue
        image = Image.open(file.as_posix())
        image.thumbnail((size, size))
        image.save(thumbnail.as_posix())
