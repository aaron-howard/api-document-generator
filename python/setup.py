from setuptools import setup, find_packages

setup(
    name="api-doc-gen-python",
    version="1.0.0",
    description="Python parser module for API Documentation Generator",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    author="API Documentation Generator Team",
    python_requires=">=3.9",
    packages=find_packages(where="python"),
    package_dir={"": "python"},
    install_requires=[
        "docstring-parser>=0.15",
        "pydoc-markdown>=4.8.0",
        "typing-extensions>=4.7.0",
        "pydantic>=2.4.0",
        "click>=8.1.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.4.0",
            "pytest-cov>=4.1.0",
            "black>=23.7.0",
            "flake8>=6.0.0",
            "mypy>=1.5.0",
            "isort>=5.12.0",
            "pre-commit>=3.4.0",
        ]
    },
    entry_points={
        "console_scripts": [
            "api-doc-gen-python=api_doc_gen_python.cli:main",
        ],
    },
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Software Development :: Documentation",
    ],
)