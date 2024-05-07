import SparkMD5 from "spark-md5";
const md5 = new SparkMD5();

class FileShard {
  constructor() {
    console.log(123);
    this.file = undefined; // 文件
    this.chunks = []; // 分片
    this.chunkHash = []; // 分片hash
    this.chunkSize = 1 * 1024 * 1024; // 默认1MB
    this.fileSize = 0; // 文件大小
    this.fileHash = undefined; // 文件hash
  }

  // 初始化
  init(file, chunkSize) {
    this.file = file;
    this.fileSize = file.size;
    this.chunkSize = chunkSize || this.chunkSize;
    // 遍历保存分片
    for (let i = 0; i < this.fileSize; i += this.chunkSize) {
      const chunk = file.slice(i, i + this.chunkSize);
      this.chunks.push(chunk);
    }
  }

  // 计算分片hash
  calculateChunkHash() {
    const result = [];
    return new Promise((resolve, reject) => {
      for (let i = 0; i < this.chunks.length; i++) {
        const blob = this.chunks[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          const chunk = e.target.result;
          result.push(md5.appendBinary(chunk).end());
          if (i === this.chunks.length - 1) {
            resolve(result);
          }
        };
        reader.onerror = (e) => {
          reject(e);
        };
        reader.readAsArrayBuffer(blob);
      }
    });
  }

  // 获取指定分片hash
  async getChunkHash(index) {
    if (this.chunkHash.length === 0) {
      await this.getAllChunkHash();
      return this.chunkHash[index];
    }
    return this.chunkHash[index];
  }

  // 获取所有分片hash
  async getAllChunkHash() {
    this.chunkHash = await this.calculateChunkHash();
    return this.chunkHash;
  }

  // 计算文件hash（增量算法）
  calculateFileHash() {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < this.chunks.length; i++) {
        const blob = this.chunks[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          const chunk = e.target.result;
          if (i === this.chunks.length - 1) {
            resolve(md5.end());
          }
          md5.appendBinary(chunk);
        };
        reader.onerror = (e) => {
          reject(e);
        };
        reader.readAsArrayBuffer(blob);
      }
    });
  }

  // 获取文件hash
  async getFileHash() {
    this.fileHash = await this.calculateFileHash();
    return this.fileHash;
  }

  // 获取指定分片
  getChunk(index) {
    return this.chunks[index];
  }

  // 获取所有分片
  getAllChunks() {
    return this.chunks;
  }

  // 获取分片数量
  getChunkCount() {
    return this.chunks.length;
  }

  // 获取指定范围内的分片
  getChunksInRange(start, end) {
    return this.chunks.slice(start, end);
  }

  // 获取文件大小
  getFileSize() {
    return this.fileSize;
  }
}

export default FileShard;
