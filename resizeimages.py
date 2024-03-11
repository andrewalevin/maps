import re
import sys
import pathlib
from string import Template

from PIL import Image

'''
GITHUB WORKFLOW

INSTALL

TOUCH FILE
 .github/workflows/resizeimages-workflow.yml

WITH CONTENT BELOW
WHERE ARGS
python3 resizeimages.py resizeimageslist.txt


=================
 name: 🥒 Resize Images - Python application
on:
  push:
    branches: [ "main" ]
permissions:
  contents: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: 🥑 Set up Python 3.10
      uses: actions/setup-python@v3
      with:
        python-version: "3.10"
    - name: 🥦 Install dependencies
      run: |
        python3 -m pip install --upgrade pip
        pip install pillow
    - name: 🥒 Make Resize
      run: |
        python3 resizeimages.py resizeimageslist.txt
    - name: 🍒 Git Auto Commit
      uses: stefanzweifel/git-auto-commit-action@v5
      with:
        commit_message: Apply automatic changes

'''

FILENAME_REGEXP_PATTERN = r'.*-\d*px$'

FILENAME_TEMPLATE = Template('$name-$sizepx')


def resize(path, size=100, allowed_extensions=None):
    if allowed_extensions is None:
        allowed_extensions = ['.png', '.jpg', '.jpeg']
    path = pathlib.Path(path)
    files = list(filter(lambda f:
                        f.suffix in allowed_extensions and
                        not re.match(FILENAME_REGEXP_PATTERN, f.stem), path.iterdir()))
    for file in files:
        thumbnail = file.with_stem(f'{file.stem}-{size}px')
        if thumbnail.exists():
            continue
        image = Image.open(file.as_posix())
        image.thumbnail((size, size))
        image.save(thumbnail.as_posix(), quality=80, optimize=True)


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
    for row in data.strip().split('\n'):
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
