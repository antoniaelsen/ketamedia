#!/usr/bin/env python

from setuptools import setup

VERSION = '0.1.0'

REQUIRES_INSTALL

setup(name='ketamedia',
  version=VERSION,
  description='Super stationary images - a VJ App',
  author='Antonia Elsen - @antoniaelsen',
  author_email='antoniaelsen@gmail.com',
  url='https://github.com/antoniaelsen/ketamedia,
  keywords="vj, music, streaming, realtime, visualizer, visuals",
  package_dir={"": "src"},
  packages=find_packages(where="src"),
  install_requires=REQUIRES_INSTALL,
  packages=[
  ],
  project_urls={  # Optional
    "Source": "https://github.com/antoniaelsen/ketamedia",
    "Bugs": "https://github.com/antoniaelsen/ketamedia/issues",
    "Say Thanks!": "https://ko-fi.com/antoniaelsen",
  },
)