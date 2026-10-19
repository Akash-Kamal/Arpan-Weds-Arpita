import React from "react";
import ChristianCross from "./ChristianCross";
import { FAMILY_DATA, MEMORIAL_LOVED_ONES } from "@/config/weddingData";
import { Heart } from "lucide-react";

export default function OurFamilies() {
  const { groom, bride } = FAMILY_DATA;

  return (
    <section id="families" className="section section-sage families-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <div className="pre-title">UNITED IN LOVE &amp; FAITH</div>
          <h2 className="section-title font-serif">With the Blessings of Our Families</h2>
          <div className="ornament-container">
            <div className="ornament-line" />
            <ChristianCross size={20} color="#C5A46D" />
            <div className="ornament-line" />
          </div>
          <p className="section-description">
            With the sacred guidance, enduring faith, and boundless love of our parents, two families unite in joyful gratitude.
          </p>
        </div>

        {/* Symmetrical Family Grid */}
        <div className="families-symmetry-grid">
          {/* ================= GROOM'S SIDE ================= */}
          <div className="family-side-card groom-side">
            <div className="side-badge">
              <span className="badge-text">GROOM’S FAMILY</span>
            </div>

            {/* Parents Card */}
            <div className="parents-card">
              <div className="generation-label">PARENTS OF THE GROOM</div>
              <h3 className="parents-names font-serif">
                {groom.fatherName} &amp; {groom.motherName}
              </h3>
              <p className="parents-blessing">
                Guiding with enduring faith, quiet strength, and endless prayers.
              </p>
            </div>

            {/* Botanical Connector Line */}
            <div className="family-tree-connector">
              <span className="connector-stem" />
              <div className="connector-node">
                <Heart size={14} className="node-icon" />
              </div>
            </div>

            {/* The Groom Primary Card */}
            <div className="principal-person-card">
              <div className="principal-monogram">A</div>
              <div className="principal-role">THE GROOM</div>
              <h3 className="principal-name font-serif">{groom.personName}</h3>
              <p className="principal-lineage">
                Beloved Son of {groom.fatherName} &amp; {groom.motherName}
              </p>
            </div>

            {/* Sibling Positions (Confirmed) */}
            <div className="family-tree-connector">
              <span className="connector-stem stem-short" />
            </div>

            <div className="siblings-cluster">
              <div className="siblings-label">SIBLINGS</div>
              <div className="siblings-grid">
                {groom.siblings?.map((sibling, idx) => (
                  <div key={idx} className="sibling-box">
                    <span className="sibling-role">{sibling.role}</span>
                    <h4 className="sibling-name font-serif">{sibling.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= BRIDE'S SIDE ================= */}
          <div className="family-side-card bride-side">
            <div className="side-badge">
              <span className="badge-text">BRIDE’S FAMILY</span>
            </div>

            {/* Parents Card (Only if specified) */}
            {bride.fatherName && bride.motherName && (
              <>
                <div className="parents-card">
                  <div className="generation-label">PARENTS OF THE BRIDE</div>
                  <h3 className="parents-names font-serif">
                    {bride.fatherName} &amp; {bride.motherName}
                  </h3>
                  <p className="parents-blessing">
                    Nurturing with gentle grace, deep devotion, and boundless love.
                  </p>
                </div>

                {/* Botanical Connector Line */}
                <div className="family-tree-connector">
                  <span className="connector-stem" />
                  <div className="connector-node">
                    <Heart size={14} className="node-icon" />
                  </div>
                </div>
              </>
            )}

            {/* The Bride Primary Card */}
            <div className="principal-person-card">
              <div className="principal-monogram">A</div>
              <div className="principal-role">THE BRIDE</div>
              <h3 className="principal-name font-serif">{bride.personName}</h3>
              <p className="principal-lineage">
                {bride.fatherName && bride.motherName
                  ? `Beloved Daughter of ${bride.fatherName} & ${bride.motherName}`
                  : "United in God's grace, walking forward in love and quiet devotion."}
              </p>
            </div>

            {/* Botanical Connector Line */}
            <div className="family-tree-connector">
              <span className="connector-stem stem-short" />
            </div>

            <div className="siblings-cluster bride-blessing-box">
              <div className="siblings-label">FAMILY BLESSINGS</div>
              <p className="bride-family-note font-serif">
                Surrounded by the prayers, love, and joyous blessings of the Simon family.
              </p>
            </div>
          </div>
        </div>

        {/* ================= REMEMBERING OUR LOVED ONES ================= */}
        <div className="memorial-tribute-section">
          <div className="memorial-card">
            <div className="memorial-cross-icon">
              <ChristianCross size={24} color="#C5A46D" />
            </div>
            <div className="memorial-pretitle">IN LOVING MEMORY</div>
            <h3 className="memorial-title font-serif">Remembering Our Loved Ones</h3>
            <p className="memorial-description">
              Forever held in our hearts and honored with profound reverence as we step forward into this holy union.
            </p>

            <div className="memorial-names-row font-serif">
              {MEMORIAL_LOVED_ONES.map((lovedOne, idx) => (
                <div key={idx} className="memorial-person-pill">
                  <span className="memorial-name">{lovedOne.name}</span>
                </div>
              ))}
            </div>

            <p className="memorial-verse font-serif">
              “Their memory is a blessing forever.” — Proverbs 10:7
            </p>
          </div>
        </div>

        {/* Scripture Union Banner */}
        <div className="union-blessing-footer">
          <p className="union-text font-serif">
            “So they are no longer two, but one flesh. Therefore, what God has joined together, let no one separate.” — Matthew 19:6
          </p>
        </div>
      </div>
    </section>
  );
}
