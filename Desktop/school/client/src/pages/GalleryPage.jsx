import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';

// Masonry gallery placeholder images with varying heights
const masonryPhotos = [
  { id: 1, src: 'https://picsum.photos/400/300?random=1', alt: 'Campus Life 1' },
  { id: 2, src: 'https://picsum.photos/400/400?random=2', alt: 'Student Activities' },
  { id: 3, src: 'https://picsum.photos/400/250?random=3', alt: 'Classroom Session' },
  { id: 4, src: 'https://picsum.photos/400/350?random=4', alt: 'College Event' },
  { id: 5, src: 'https://picsum.photos/400/300?random=5', alt: 'Sports Day' },
  { id: 6, src: 'https://picsum.photos/400/400?random=6', alt: 'Cultural Program' },
  { id: 7, src: 'https://picsum.photos/400/250?random=7', alt: 'Library' },
  { id: 8, src: 'https://picsum.photos/400/350?random=8', alt: 'Lab Session' },
  { id: 9, src: 'https://picsum.photos/400/300?random=9', alt: 'Group Study' },
  { id: 10, src: 'https://picsum.photos/400/400?random=10', alt: 'Graduation' },
  { id: 11, src: 'https://picsum.photos/400/250?random=11', alt: 'Workshop' },
  { id: 12, src: 'https://picsum.photos/400/350?random=12', alt: 'Seminar' },
  { id: 13, src: 'https://picsum.photos/400/300?random=13', alt: 'Campus View' },
  { id: 14, src: 'https://picsum.photos/400/400?random=14', alt: 'Annual Function' },
  { id: 15, src: 'https://picsum.photos/400/250?random=15', alt: 'Student Council' },
  { id: 16, src: 'https://picsum.photos/400/350?random=16', alt: 'Award Ceremony' },
  { id: 17, src: 'https://picsum.photos/400/300?random=17', alt: 'Field Trip' },
  { id: 18, src: 'https://picsum.photos/400/400?random=18', alt: 'College Festival' },
];

export default function GalleryPage() {
  // Masonry lightbox state
  const [masonryLightbox, setMasonryLightbox] = useState(false);
  const [masonryIndex, setMasonryIndex] = useState(0);

  // Masonry lightbox functions
  const openMasonryLightbox = (index) => {
    setMasonryIndex(index);
    setMasonryLightbox(true);
  };

  const closeMasonryLightbox = () => {
    setMasonryLightbox(false);
  };

  const prevMasonryImage = () => {
    setMasonryIndex((prev) =>
      prev === 0 ? masonryPhotos.length - 1 : prev - 1
    );
  };

  const nextMasonryImage = () => {
    setMasonryIndex((prev) =>
      prev === masonryPhotos.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <Helmet>
        <title>Gallery — Kasturi College</title>
        <meta name="description" content="View photos from Kasturi College campus, events, classrooms, sports, and more." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary-800 text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url('/college_front.jpg')` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/85 to-primary-800/95" />
        <div className="absolute inset-0 pattern-academic opacity-20" />
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-2 text-accent-500 font-bold text-sm uppercase tracking-widest mb-4">
             <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
             Our Campus
             <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-display tracking-tight border-b-2 border-accent-500/30 inline-block pb-4">Photo Gallery</h1>
          <p className="text-xl text-primary-50 max-w-2xl mx-auto font-light leading-relaxed">A glimpse into life at Kasturi College — our campus, events, and more.</p>
        </div>
      </section>

      {/* Masonry Gallery Section */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          {/* Section Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a4a2e] font-display tracking-tight inline-block relative">
              Our Gallery
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#c9a84c] rounded-full"></span>
            </h2>
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {masonryPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => openMasonryLightbox(index)}
                className="relative break-inside-avoid rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#1a4a2e]/0 group-hover:bg-[#1a4a2e]/60 transition-all duration-300 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 border border-white/30">
                    <FaExpand className="text-white text-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Lightbox */}
      {masonryLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 transition-all" onClick={closeMasonryLightbox}>
          <button onClick={closeMasonryLightbox} className="absolute top-6 right-6 text-white/50 hover:text-white text-2xl z-10 transition-colors w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10">
            <FaTimes />
          </button>

          <button onClick={(e) => { e.stopPropagation(); prevMasonryImage(); }} className="absolute left-4 sm:left-8 text-white/50 hover:text-white text-xl z-10 transition-colors w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10">
            <FaChevronLeft />
          </button>

          <button onClick={(e) => { e.stopPropagation(); nextMasonryImage(); }} className="absolute right-4 sm:right-8 text-white/50 hover:text-white text-xl z-10 transition-colors w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10">
            <FaChevronRight />
          </button>

          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative bg-black">
              <img
                src={masonryPhotos[masonryIndex].src.replace(/\d+x\d+/, '800/600')}
                alt={masonryPhotos[masonryIndex].alt}
                className="w-full h-auto max-h-[80vh] object-contain mx-auto"
              />
            </div>

            <div className="text-center mt-8">
              <h3 className="text-white text-2xl font-bold font-display tracking-tight mb-2">{masonryPhotos[masonryIndex].alt}</h3>
              <p className="text-white/40 text-sm font-medium tracking-widest mt-4">
                <span className="text-[#c9a84c]">{masonryIndex + 1}</span> / {masonryPhotos.length} photos
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
