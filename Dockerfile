FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    ffmpeg \
    libcairo2-dev \
    libpango1.0-dev \
    pkg-config \
    python3-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

RUN pip install manim flask

WORKDIR /app
COPY . .

EXPOSE 5000
CMD ["python", "server.py"]