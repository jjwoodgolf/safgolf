interface Photo {
  src: string;
  alt: string;
}

const PhotoGallery = ({ items, caption }: { items: Photo[]; caption?: string }) => (
  <figure>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {items.map((p, i) => (
        <img
          key={i}
          src={p.src}
          alt={p.alt}
          loading="lazy"
          className="w-full aspect-square object-cover rounded-sm bg-muted"
        />
      ))}
    </div>
    {caption && <figcaption className="mt-4 text-sm text-muted-foreground">{caption}</figcaption>}
  </figure>
);

export default PhotoGallery;
