package lehanncronje.merkletreefilesystem.utils

import java.security.MessageDigest

fun String.sha256(): String {
    return hashString(this)
}

private fun hashString(input: String): String {
    return MessageDigest
        .getInstance("SHA-256")
        .digest(input.toByteArray())
        .joinToString(separator = "") { String.format("%02x", it) }
}