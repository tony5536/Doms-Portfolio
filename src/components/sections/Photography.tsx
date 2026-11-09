import { gallery } from "@/data/gallery";
import Gallery from "@/components/portfolio/Gallery";
import SectionHeader from "@/components/ui/SectionHeader";

export default function Photography() {
  return (
    <section id="photography" className="section-y relative bg-ink-2" aria-labelledby="photography-title">
      <SectionHeader
        id="photography-title"
        index="03"
        label="Photography"
        title="Still Frames"
        intro="Portraits, fashion, editorial and the moments in between."
      />
      <Gallery images={gallery} />
    </section>
  );
}
