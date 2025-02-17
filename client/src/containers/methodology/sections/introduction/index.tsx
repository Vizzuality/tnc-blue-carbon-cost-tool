import { MethodologySection } from "@/containers/methodology/sections";
import ContentWrapper from "@/containers/methodology/wrapper";

import { List } from "@/components/ui/list";
import Title from "@/components/ui/title";

const Introduction: MethodologySection = {
  id: "introduction",
  title: "Introduction",
  href: "#introduction",
  Content: (
    <ContentWrapper>
      <p>
        To better understand the financials of blue carbon projects, The Nature
        Conservancy (TNC), in collaboration with Bain & Company, has developed
        the <strong>Blue Carbon Cost Tool</strong>. This
        <strong>pre-feasibility tool</strong> provides high-level estimations of
        project costs and carbon benefits for blue carbon projects, allowing for
        project-specific scenario analysis and qualitative metrics for{" "}
        <strong>project prioritization</strong>. Stakeholders can utilize this
        tool to gain valuable insights into the financial aspects of blue carbon
        projects. Designed as an early-stage planning resource, the tool offers
        both default values and customizable options for tailored assessments,
        while not being intended for tracking cost over time.
      </p>
      <p>
        As blue carbon ecosystems—including mangroves, salt marshes, and
        seagrasses—gain recognition for their critical role in carbon
        sequestration and climate resilience, this tool addresses key knowledge
        gaps in project costs and funding needs. Its insights support efficient
        resource allocation, enabling successful conservation and restoration
        initiatives in the fight against climate change.
      </p>

      <Title as="h3" size="lg" className="font-normal">
        Blue Carbon Cost Tool overview
      </Title>

      <p>Two main sections can be found in the tool:</p>
      <List>
        <li>
          The <strong>Projects Overview</strong> offers a comprehensive view of
          typical project costs and carbon benefits. Beyond financial
          considerations, it also incorporates non-financial aspects across
          countries, ecosystems, and activities, providing a more holistic
          perspective even though customization options are somewhat limited.
          The key use case for the Projects overview tool revolves around
          understanding feasibility of blue carbon projects, and prioritizing
          projects based on both financial and non-financial information.
        </li>
        <li>
          The <strong>Create Custom Project</strong> feature of the Blue Carbon
          Cost Tool provides a detailed framework and scenario modelling for
          generating ‘snapshot’ estimations of project costs and carbon benefits
          while enabling project-specific scenario analysis. This version
          features a comprehensive model that integrates key analyses,
          assumptions, and data sources, allowing users to select either default
          values or customize inputs based on their specific project needs. Its
          primary purpose is to simulate the financial and carbon outcomes of a
          user-defined project, offering insights to support informed
          decision-making.
        </li>
      </List>

      <div>
        <Title as="h4" size="sm" className="font-semibold underline">
          Project types
        </Title>
        <p>
          The Blue Carbon Cost Tool is designed for conservation and restoration
          projects of coastal blue carbon ecosystems, specifically&nbsp;
          <strong>targeting mangroves, salt marshes, and seagrass</strong>.
          These have been prioritized due to their significant potential as
          actionable blue carbon pathways as well as current availability of
          data.
        </p>
      </div>
      <p>
        <strong>Two types of high-level activities were considered</strong>:
      </p>
      <List>
        <li>
          <strong>Conservation (avoided loss):</strong> Preserving existing blue
          carbon stocks through avoided degradation. This approach is
          cost-effective, prevents biodiversity and carbon stock loss, enhances
          resilience, and aligns with the climate mitigation hierarchy by
          prioritizing prevention before restoration.
        </li>
        <li>
          <strong>Restoration (removals):</strong> Focused on three project
          types:
          <List>
            <li>
              <strong>Planting:</strong> Seed planting and nursery establishment
              to regenerate and expand coastal vegetation.
            </li>
            <li>
              <strong>Hydrology:</strong> Activities such as erosion repair,
              water flow restoration, and infrastructure improvements like
              culverts and breakwaters.
            </li>
            <li>
              <strong>Hybrid:</strong> Combines planting and hydrology for
              comprehensive ecosystem restoration. ecosystem restoration.
            </li>
          </List>
        </li>
      </List>
      <div>
        <Title as="h4" size="sm" className="font-semibold underline">
          Countries
        </Title>
        <p>
          The countries included in the Blue Carbon Cost Tool are limited to
          those <strong>countries or regions</strong> which have data available
          for blue carbon projects. As of 2025, the selected countries or
          regions represent a significant proportion of the global blue carbon
          sink potential, approximately 63% of global restoration potential and
          37% of global conservation potential.
        </p>
      </div>
    </ContentWrapper>
  ),
};

export default Introduction;
