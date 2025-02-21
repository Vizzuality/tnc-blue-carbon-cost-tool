/**
 * This file contains only math equations written in MathML
 * React currently does not have TS support for MathML, so we need to disable the eslint + ts-check
 */

// eslint-disable-next-line
//@ts-nocheck

const Math1 = () => {
  return (
    <math display="block">
      <mrow>
        <mtext>Annual avoided loss (ha)</mtext>
        <msub>
          <mrow></mrow>
          <mi>t</mi>
        </msub>
        <mo>=</mo>
        <mrow>
          <mtext>Project area in baseline (ha)</mtext>
          <msub>
            <mrow></mrow>
            <mrow>
              <mi mathvariant="script">t</mi>
              <mo>-</mo>
              <mn>1</mn>
            </mrow>
          </msub>
          <mo>&#xA0;</mo>
          <mi mathvariant="script">x</mi>
          <mo>loss rate (%)</mo>
        </mrow>
      </mrow>
    </math>
  );
};

const Math2 = () => {
  return (
    <math display="block">
      <mrow>
        <mi>Cumulative avoided loss (ha)</mi>
        <msub>
          <mrow></mrow>
          <mi>t</mi>
        </msub>
        <mo>=</mo>
        <munderover>
          <mo>&#x2211;</mo>
          <mrow>
            <mi mathvariant="script">i</mi>
            <mo>=</mo>
            <mn>1</mn>
          </mrow>
          <mrow>
            <mo>t</mo>
          </mrow>
        </munderover>
        <mi>Annual avoided loss (ha)</mi>
        <msub>
          <mrow></mrow>
          <mi>i</mi>
        </msub>
      </mrow>
    </math>
  );
};

const Math3 = () => {
  return (
    <math display="block">
      <mrow>
        <mtext>Carbon reduction</mtext>
        <msub>
          <mrow></mrow>
          <mi>t</mi>
        </msub>
        <mtext>&#xA0;(tCO2e in year</mtext>
        <mi>t</mi>
        <mtext>)</mtext>
        <mo>=</mo>
        <mtext>Cumulative avoided loss (ha)</mtext>
        <msub>
          <mrow></mrow>
          <mrow>
            <mi>t</mi>
          </mrow>
        </msub>
        <mo>*</mo>
        <mtext>
          &#xA0;(Tier 1 emission factor (<mi>tCO2e</mi>&#xA0;per ha per year) +
          Tier 1 sequestration factor (<mi>tCO2e</mi>
          &#xA0;per ha per year))
        </mtext>
      </mrow>
    </math>
  );
};

const Math4 = () => {
  return (
    <math display="block" className="space-y-2">
      <mrow>
        <mtext>Above ground biomass: Carbon reduction AGB</mtext>
        <msub>
          <mrow></mrow>
          <mi>t</mi>
        </msub>
        <mtext>
          &#xA0;(<mi>tCO2e</mi>&#xA0;in year
        </mtext>
        <mi>t</mi>
        <mtext>)</mtext>
        <mo>=</mo>
        <mtext>
          Annual avoided loss (ha in year <mi>t</mi>)
        </mtext>
        <msub>
          <mrow></mrow>
          <mrow>
            <mi>t</mi>
          </mrow>
        </msub>
        <mtext>&#xA0;</mtext>
        <mi>x</mi>
        <mtext>&#xA0;Tier 2 AGB emission factor (</mtext>
        <mi>tCO2e</mi>
        <mtext>&#xA0;per ha per year)</mtext>
      </mrow>
      <mrow>
        <mtext>Soil organic carbon: Carbon reduction SOC</mtext>
        <msub>
          <mrow></mrow>
          <mi>t</mi>
        </msub>
        <mtext>&#xA0;(tCO2e in year</mtext>
        <mi>t</mi>
        <mtext>)</mtext>
        <mo>=</mo>
        <mtext>Cumulative avoided loss (ha)</mtext>
        <msub>
          <mrow></mrow>
          <mrow>
            <mi>t</mi>
          </mrow>
        </msub>
        <mtext>&#xA0;</mtext>
        <mi>x</mi>
        <mtext>&#xA0;Tier 2 SOC emission factor (</mtext>
        <mi>tCO2e</mi>
        <mtext>&#xA0;per ha per year)</mtext>
      </mrow>
      <mrow>
        <mtext>Additional sequestration: Additional sequestration</mtext>
        <msub>
          <mrow></mrow>
          <mi>t</mi>
        </msub>
        <mtext>&#xA0;(tCO2e in year</mtext>
        <mi>t</mi>
        <mtext>)</mtext>
        <mo>=</mo>
        <mtext>Tier 1 sequestration rate (</mtext>
        <mi>tCO2e</mi>
        <mtext>&#xA0;per ha per year)</mtext>
        <mo>*</mo>
        <mtext>&#xA0;Cumulative avoided loss (ha)</mtext>
        <msub>
          <mrow></mrow>
          <mrow>
            <mi>t</mi>
          </mrow>
        </msub>
      </mrow>
    </math>
  );
};

const Math5 = () => {
  return (
    <math display="block">
      <mrow>
        <mtext>
          Carbon reduction &#xA0;(<mi>tCO2e</mi>&#xA0;in year
        </mtext>
        <mi>t</mi>
        <mtext>)</mtext>
        <mo>=</mo>
        <mtext>Carbon reduction AGB</mtext>
        <msub>
          <mrow></mrow>
          <mrow>
            <mi>t</mi>
          </mrow>
        </msub>
        <mo>+</mo>
        <mtext>Carbon reduction SOC</mtext>
        <msub>
          <mrow></mrow>
          <mrow>
            <mi>t</mi>
          </mrow>
        </msub>
        <mo>+</mo>
        <mtext>Additional sequestration</mtext>
        <msub>
          <mrow></mrow>
          <mrow>
            <mi>t</mi>
          </mrow>
        </msub>
      </mrow>
    </math>
  );
};

const Math6 = () => {
  return (
    <math display="block">
      <mrow>
        <mtext>Carbon credits</mtext>
        <msub>
          <mrow></mrow>
          <mrow>
            <mi>t</mi>
          </mrow>
        </msub>
        <mtext>
          &#xA0;(<mi>tCO2e</mi>&#xA0;in year
        </mtext>
        <mi>t</mi>
        <mtext>)</mtext>
        <mo>=</mo>
        <mtext>Carbon reduction</mtext>
        <msub>
          <mrow></mrow>
          <mrow>
            <mi>t</mi>
          </mrow>
        </msub>
        <mtext>
          &#xA0;(<mi>tCO2e</mi>&#xA0;in year
        </mtext>
        <mi>t</mi>
        <mtext>)</mtext>
        <mo>*</mo>
        <mtext>
          &#xA0;(
          <mi>1</mi>&#xA0;
          <mo>-</mo>&#xA0;buffer(%))
        </mtext>
      </mrow>
    </math>
  );
};

const Math7 = () => {
  return (
    <math display="block">
      <mrow>
        <mtext>Carbon revenue</mtext>
        <msub>
          <mrow></mrow>
          <mrow>
            <mi>t</mi>
          </mrow>
        </msub>
        <mtext>
          &#xA0;(<mi>$</mi>&#xA0;in year
        </mtext>
        <mi>t</mi>
        <mtext>)</mtext>
        <mo>=</mo>
        <mtext>Carbon credits</mtext>
        <msub>
          <mrow></mrow>
          <mrow>
            <mi>t</mi>
          </mrow>
        </msub>
        <mtext>
          &#xA0;(<mi>tCO2e</mi>&#xA0;in year
        </mtext>
        <mi>t</mi>
        <mtext>)</mtext>
        <mo>*</mo>
        <mtext>&#xA0;Carbon credit price (</mtext>
        <mi>$/tCO2e</mi>
        <mtext>)</mtext>
      </mrow>
    </math>
  );
};

const Math8 = () => {
  return (
    <math display="block">
      <mrow>
        <mtext>Carbon reduction</mtext>
        <msub>
          <mrow></mrow>
          <mrow>
            <mi>t</mi>
          </mrow>
        </msub>
        <mtext>
          &#xA0;(<mi>tCO2e</mi>&#xA0;in year
        </mtext>
        <mi>t</mi>
        <mtext>)</mtext>
        <mo>=</mo>
        <mtext>Restored area (ha)</mtext>
        <msub>
          <mrow></mrow>
          <mrow>
            <mi>t</mi>
          </mrow>
        </msub>
        <mtext>&#xA0;</mtext>
        <mi>x</mi>
        <mtext>&#xA0;</mtext>
        <mtext>Sequestration rate</mtext>
        <mtext>
          &#xA0;(<mi>tCO2e / ha / year</mi>)&#xA0;
        </mtext>
        <mtext>&#xA0;</mtext>
        <mi>x</mi>
        <mtext>&#xA0;</mtext>
        <mtext>
          (if planting: planting success rate (%), if hydrology<mo>/</mo>hybrid:
          100%)
        </mtext>
      </mrow>
    </math>
  );
};

const Math9 = () => {
  return (
    <math display="block">
      <mrow>
        <mtext>Carbon credits</mtext>
        <msub>
          <mrow></mrow>
          <mrow>
            <mi>t</mi>
          </mrow>
        </msub>
        <mtext>
          &#xA0;(<mi>tCO2e</mi>&#xA0;in year
        </mtext>
        <mi>t</mi>
        <mtext>)</mtext>
        <mo>=</mo>
        <mtext>Carbon reduction</mtext>
        <msub>
          <mrow></mrow>
          <mrow>
            <mi>t</mi>
          </mrow>
        </msub>
        <mtext>
          &#xA0;(<mi>tCO2e</mi>&#xA0;in year
        </mtext>
        <mi>t</mi>
        <mtext>)</mtext>
        <mo>*</mo>
        <mtext>
          &#xA0;(1&#xA0;<mo>-</mo>&#xA0;
          <mi>buffer(%)</mi>)
        </mtext>
      </mrow>
    </math>
  );
};

const Math10 = () => {
  return (
    <math display="block">
      <mrow>
        <mtext>Carbon revenue</mtext>
        <msub>
          <mrow></mrow>
          <mrow>
            <mi>t</mi>
          </mrow>
        </msub>
        <mtext>(</mtext>
        <mi>$</mi>
        <mtext>&#xA0;in year</mtext>
        <mi>t</mi>
        <mtext>)</mtext>
        <mo>=</mo>
        <mtext>Carbon credits</mtext>
        <msub>
          <mrow></mrow>
          <mrow>
            <mi>t</mi>
          </mrow>
        </msub>
        <mtext>(</mtext>
        <mi>tCO2e in year t</mi>
        <mtext>)</mtext>
        <mo>*</mo>
        <mtext>Carbon credit price</mtext>
        <mtext>
          &#xA0;(<mi>$/tCO2e</mi>)&#xA0;
        </mtext>
      </mrow>
    </math>
  );
};

export {
  Math1,
  Math2,
  Math3,
  Math4,
  Math5,
  Math6,
  Math7,
  Math8,
  Math9,
  Math10,
};
