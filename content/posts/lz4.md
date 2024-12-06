+++
title = "Lz4 compression algorithm : A Deep Dive"
description = "LZ4 is a lossless compression algorithm based on the LZ77 algorithm. It compresses data by identifying repeating patterns and encoding them in a compact format. The focus of LZ4 is on high-speed compression and decompression, making it suitable for real-time applications where performance is critical."
date = "2024-12-06"
[taxonomies]
tags=["blog", "Algorithms"]
+++

# Intorduction

Data compression has become a cornerstone of efficient storage and faster data transfers. Among the myriad of compression algorithms available, LZ4 stands out for its speed. It achieves remarkable compression and decompression speeds while maintaining reasonable compression ratios. This blog explores the inner workings of LZ4, its practical use cases, and its advantages over other algorithms.

# What is Lz4

LZ4 is a lossless compression algorithm based on the LZ77 algorithm. It compresses data by identifying repeating patterns and encoding them in a compact format. The focus of LZ4 is on high-speed compression and decompression, making it suitable for real-time applications where performance is critical.

> It's also default compression algorithm for most Columnar DB like Clickhouse

# Key Features of LZ4
- `High Speed:` Compression and decompression speeds of 400-500 MB/s per core. Ideal for scenarios where speed is more critical than compression ratio.
- `Small Memory Footprint:` Sliding window approach reduces memory usage compared to dictionary-based algorithms.
- `Cross-Platform Support:` Widely used in tools, databases, and storage systems.
- `Streaming-Friendly:` Supports block-based compression, making it suitable for streaming large data sets.

# How Does LZ4 Work?

## The Core Idea
LZ4 is inspired by the LZ77 algorithm. It identifies repeating sequences in the data and replaces them with a reference to the previous occurrence. The reference is represented as an offset-length pair, reducing redundancy.

## The Building Blocks
- ### Sliding Window:
- LZ4 maintains a sliding window (default: 64 KB) to store the recently processed data.
- This window acts as a "dictionary" to find repeating patterns.
- The dictionary is the sliding window of data being processed.
- It is not stored in the compressed file. No, it is transient and exists only in memory during compression and decompression
- `During compression:`
Used to find matches in the input data.
- `During decompression:`
Reconstructed incrementally by copying previously decompressed data into the output buffer.


- ### Tokens:
The compressed data is represented as tokens, consisting of:
- `Literals:` Uncompressed raw data.
- `Matches:` (offset, length) pairs pointing to previous sequences.

- ### Hash Table:
A hash table maps fixed-length sequences (e.g., 4 bytes) in the sliding window to their positions.
Enables fast lookup for pattern matching.


