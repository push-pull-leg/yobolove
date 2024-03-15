export type ImageExtensionType = "png" | "jpeg" | "jpg" | "gif";
type Base64ImageType<T extends ImageExtensionType = ImageExtensionType> = `data:image/${T};base64${string}`;
export type Base64SignType = Base64ImageType<"png" | "jpeg">;
export default Base64ImageType;
