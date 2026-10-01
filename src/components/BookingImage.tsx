import Image, { type ImageProps } from "next/image";

/** Keep the supplied 4K edition available without making phones download it. */
export default function BookingImage(props: Omit<ImageProps, "src"> & { src: string }) {
  const { priority, ...imageProps } = props;
  const srcSet = [960, 1920, 3840].map(width => `${props.src.replace("-4k.webp", `-${width === 3840 ? "4k" : width}.webp`)} ${width}w`).join(", ");
  return <picture style={{ display: "contents" }}><source type="image/webp" srcSet={srcSet} sizes={props.sizes ?? "100vw"} /><Image {...imageProps} loading={priority ? "eager" : props.loading} fetchPriority={priority ? "high" : props.fetchPriority} /></picture>;
}
