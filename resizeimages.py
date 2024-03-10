import sys
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


def read_file(path) -> str:
    path = pathlib.Path(path)
    try:
        with open(path.resolve().as_posix()) as f:
            data = f.read()
    except Exception as err:
        print(f'Error with reading file!')
        print(err)
        print()
    return data
    

def make_multiple_resize(path):
    data = read_file(path)
    for row in data.split('\n'):
        row = row.strip()
        parts = row.split(' ')
        print(parts)
        target = pathlib.Path(parts[0])
        if not target.exists():
            print(f'🔴 Path {target} not exists')
            continue
            
        size = parts[1]
        if not size.isnumeric:
            print(f'🔴 size is not numeric')
            continue
            
        size = int(size)
        if size <= 0:
            print(f'🔴 size isnot>0')
            continue
        
        resize(target, size)
        

TEXT_ARGS = '''
🔴  check arg!

It should be path of filelist 

resizeimageslist.txt

with rows:
target dir and size


imgs 100
imgs2 200
imgs3 ervfer
imgs0 200
'''

if __name__ == "__main__":
	if len(sys.argv) == 2:
		make_multiple_resize(sys.argv[1])
	else:
		print(TEXT_ARGS)
