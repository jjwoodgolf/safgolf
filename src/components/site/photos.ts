// Registry of authentic SAF / GPG photography. Sources documented in docs/SAF-content-sources.md.
import varsityShortGame from "@/assets/photos/varsity-short-game.jpg";
import jjVarsityCommunity from "@/assets/photos/jj-varsity-community.jpg";
import rice2014 from "@/assets/photos/rice-2014-cusa-champions.jpg";
import riceCoaching from "@/assets/photos/rice-coaching.jpg";
import riceTeam from "@/assets/photos/rice-2014-cusa-team.jpg";
import pgaHope from "@/assets/photos/pga-hope-veterans-clinic.jpg";
import varsitySeminar from "@/assets/photos/varsity-seminar.jpg";
import varsityCoachDiscussion from "@/assets/photos/varsity-coach-discussion.jpg";
import varsityPractice from "@/assets/photos/varsity-practice.jpg";
import varsityFitness from "@/assets/photos/varsity-fitness.jpg";
import varsityWinterRange from "@/assets/photos/varsity-winter-range.jpg";
import combine2014 from "@/assets/photos/combine-2014-showcase.jpg";
import combineUh from "@/assets/photos/combine-uh-camp.jpg";
import combineHbu from "@/assets/photos/combine-hbu-camp.jpg";
import s01 from "@/assets/success-gallery/student-01.jpg";
import s02 from "@/assets/success-gallery/student-02.jpg";
import s03 from "@/assets/success-gallery/student-03.jpg";
import s04 from "@/assets/success-gallery/student-04.jpg";
import s05 from "@/assets/success-gallery/student-05.jpg";
import s06 from "@/assets/success-gallery/student-06.jpg";
import s07 from "@/assets/success-gallery/student-07.jpg";
import s08 from "@/assets/success-gallery/student-08.jpg";
import s09 from "@/assets/success-gallery/student-09.jpg";
import s10 from "@/assets/success-gallery/student-10.jpg";
import s11 from "@/assets/success-gallery/student-11.jpg";
import s12 from "@/assets/success-gallery/student-12.jpg";
import s13 from "@/assets/success-gallery/student-13.jpg";
import s14 from "@/assets/success-gallery/student-14.jpg";

export const photos = {
  varsityShortGame: { src: varsityShortGame, alt: "Junior golfers practicing with coaches in the Varsity program" },
  jjVarsityCommunity: { src: jjVarsityCommunity, alt: "JJ Wood with members of the Varsity junior golf group" },
  rice2014: { src: rice2014, alt: "Rice University men's golf team with the 2014 Conference USA championship banner" },
  riceCoaching: { src: riceCoaching, alt: "JJ Wood coaching a Rice University player during a college tournament round" },
  riceTeam: { src: riceTeam, alt: "Rice University men's golf team and staff with the 2014 Conference USA championship trophy" },
  pgaHope: { src: pgaHope, alt: "Veterans and instructors at a PGA HOPE golf clinic" },
  varsitySeminar: { src: varsitySeminar, alt: "Varsity players attending an indoor coaching seminar" },
  varsityCoachDiscussion: { src: varsityCoachDiscussion, alt: "Coaches talking with Varsity players on the practice range" },
  varsityPractice: { src: varsityPractice, alt: "Varsity players working on technique drills on the range" },
  varsityFitness: { src: varsityFitness, alt: "Varsity players in a group fitness session" },
  varsityWinterRange: { src: varsityWinterRange, alt: "Varsity players practicing on the range in winter" },
  combine2014: { src: combine2014, alt: "Players at the 2014 SAF college golf showcase" },
  combineUh: { src: combineUh, alt: "College coach observing juniors at an SAF showcase" },
  combineHbu: { src: combineHbu, alt: "Coach speaking with junior golfers at an SAF showcase" },
};

export const communityGallery = [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, s13, s14].map(
  (src) => ({ src, alt: "Player from the SAF and Varsity coaching community" }),
);
