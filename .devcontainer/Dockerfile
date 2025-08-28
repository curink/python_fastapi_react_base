FROM ubuntu:22.04

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    libssl-dev \
    pkg-config \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Install Python 3.12.11
RUN curl -fsSL https://bootstrap.pypa.io/get-pip.py -o get-pip.py && \
    python3 get-pip.py && \
    rm get-pip.py

# Install Rust 1.88.0 with rustup
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --profile minimal --default-toolchain 1.88.0
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Node.js 24.4.1 using nvm
ENV NVM_DIR=/usr/local/nvm
ENV NODE_VERSION=24.4.1
RUN mkdir -p $NVM_DIR && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash && \
    . "$NVM_DIR/nvm.sh" && \
    nvm install $NODE_VERSION && \
    nvm alias default $NODE_VERSION && \
    nvm use default

ENV PATH="$NVM_DIR/versions/node/v$NODE_VERSION/bin:${PATH}"

# Install common Python data science libraries
RUN pip3 install --no-cache-dir \
    numpy \
    pandas \
    matplotlib \
    seaborn \
    scikit-learn \
    jupyter \
    ipykernel

# Install Rust tools and components
RUN rustup component add \
    rustfmt \
    rust-analysis \
    rust-src \
    clippy

# Install Node.js global packages
RUN npm install -g \
    typescript \
    ts-node \
    nodemon \
    eslint \
    prettier

# Create workspace directory
WORKDIR /workspace

# Copy requirements file if exists
COPY requirements.txt ./
RUN if [ -f "requirements.txt" ]; then pip3 install -r requirements.txt; fi

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
