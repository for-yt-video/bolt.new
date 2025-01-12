import { Buffer } from 'node:buffer';
import { getEncoding } from 'istextorbinary';

export class FileContentManager {
  private utf8TextDecoder = new TextDecoder('utf8', { fatal: true });

  processFileContent(buffer?: Uint8Array) {
    const isBinary = this.isBinaryFile(buffer);
    const content = !isBinary ? this.decodeFileContent(buffer) : '';
    
    return { content, isBinary };
  }

  private decodeFileContent(buffer?: Uint8Array) {
    if (!buffer || buffer.byteLength === 0) {
      return '';
    }

    try {
      return this.utf8TextDecoder.decode(buffer);
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  private isBinaryFile(buffer: Uint8Array | undefined) {
    if (buffer === undefined) {
      return false;
    }

    return getEncoding(this.convertToBuffer(buffer), { chunkLength: 100 }) === 'binary';
  }

  /**
   * Converts a `Uint8Array` into a Node.js `Buffer` by copying the prototype.
   * The goal is to avoid expensive copies. It does create a new typed array
   * but that's generally cheap as long as it uses the same underlying
   * array buffer.
   */
  private convertToBuffer(view: Uint8Array): Buffer {
    const buffer = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
    Object.setPrototypeOf(buffer, Buffer.prototype);
    return buffer as Buffer;
  }
} 