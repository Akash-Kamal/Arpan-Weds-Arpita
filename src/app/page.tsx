import MobileAppHeader from "@/components/MobileAppHeader";
import MobileAppNav from "@/components/MobileAppNav";
import WeddingHero from "@/components/WeddingHero";
import OfficialInvitationCard from "@/components/OfficialInvitationCard";
import BlessingSection from "@/components/BlessingSection";
import OurFamilies from "@/components/OurFamilies";
import OurStory from "@/components/OurStory";
import EventTimeline from "@/components/EventTimeline";
import WeddingGallery from "@/components/WeddingGallery";
import RSVPForm from "@/components/RSVPForm";
import FAQAccordion from "@/components/FAQAccordion";
import WeddingFooter from "@/components/WeddingFooter";

export default function Home() {
  return (
    <div className="mobile-app-wrapper">
      {/* Centered Phone Shell */}
      <div className="mobile-phone-device">
        <MobileAppHeader />

        <main id="main-content" className="mobile-app-content">
          <WeddingHero />
          <OfficialInvitationCard />
          <BlessingSection />
          <OurFamilies />
          <OurStory />
          <EventTimeline />
          <WeddingGallery />
          <RSVPForm />
          <FAQAccordion />
          <WeddingFooter />
        </main>

        <MobileAppNav />
      </div>
    </div>
  );
}
