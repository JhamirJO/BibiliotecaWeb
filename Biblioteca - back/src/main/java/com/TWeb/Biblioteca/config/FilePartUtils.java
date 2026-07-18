
package com.TWeb.Biblioteca.config;

import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Mono;

import java.nio.ByteBuffer;

public final class FilePartUtils {

    private FilePartUtils() {}

    /** Lee todo el FilePart a byte[] en modo reactivo. */
    public static Mono<byte[]> toBytes(FilePart filePart) {
        return DataBufferUtils.join(filePart.content())
                .map(FilePartUtils::toByteArraySafely)
                .doOnDiscard(DataBuffer.class, DataBufferUtils::release);
    }

    /** Lee y valida tamaño máximo (en bytes). */
    public static Mono<byte[]> toBytesWithMax(FilePart filePart, long maxBytes) {
        return toBytes(filePart).flatMap(bytes -> {
            if (bytes.length == 0) {
                return Mono.error(new IllegalArgumentException("archivo vacío"));
            }
            if (bytes.length > maxBytes) {
                return Mono.error(new IllegalArgumentException("archivo excede tamaño máximo"));
            }
            return Mono.just(bytes);
        });
    }

    /** Convierte DataBuffer → byte[] y libera el buffer. */
    private static byte[] toByteArraySafely(DataBuffer dataBuffer) {
        try {
            ByteBuffer bb = dataBuffer.asByteBuffer();
            byte[] out = new byte[bb.remaining()];
            bb.get(out);
            return out;
        } finally {
            DataBufferUtils.release(dataBuffer);
        }
    }
}