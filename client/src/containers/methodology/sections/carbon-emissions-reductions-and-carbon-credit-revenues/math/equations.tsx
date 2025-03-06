/**
 * This file contains only math equations written in MathML
 * React currently does not have TS support for MathML, so we need to disable the eslint + ts-check
 */

// eslint-disable-next-line
//@ts-nocheck

const Math = ({ children }: { children: React.ReactNode }) => {
  return (
    <math display="block" className="px-4 py-2">
      {children}
    </math>
  );
};

const Math1 = () => {
  return (
    <Math>
      <mrow>
        <msub>
          <mtext>Annual avoided loss (ha)</mtext>
          <mi>t</mi>
        </msub>
        <mo>=</mo>
        <mrow>
          <msub>
            <mtext>Project area in baseline (ha)</mtext>
            <mrow>
              <mi>t</mi>
              <mo>-</mo>
              <mn>1</mn>
            </mrow>
          </msub>
          <mspace width="0.25em" />
          <mi>x</mi>
          <mo>loss rate (%)</mo>
        </mrow>
      </mrow>
    </Math>
  );
};

const Math2 = () => {
  return (
    <Math>
      <mrow>
        <msub>
          <mtext>Cumulative avoided loss (ha)</mtext>
          <mi>t</mi>
        </msub>
        <mo>=</mo>
        <munderover>
          <mo>∑</mo>
          <mrow>
            <mi>i</mi>
            <mo>=</mo>
            <mn>0</mn>
          </mrow>
          <mi>N</mi>
        </munderover>
        <msub>
          <mi>Annual avoided loss (ha)</mi>
          <mi>i</mi>
        </msub>
      </mrow>
    </Math>
  );
};

const Math3 = () => {
  return (
    <Math>
      <mrow>
        <msub>
          <mtext>Carbon reduction</mtext>
          <mi>t</mi>
        </msub>
        <mspace width="0.25em" />
        <mrow>
          <mi>(</mi>
          <mtext>tCO2e in year t</mtext>
          <mi>)</mi>
        </mrow>
        <mo>=</mo>
        <msub>
          <mtext>Cumulative avoided loss (ha)</mtext>
          <mi>t</mi>
        </msub>
        <mo>*</mo>
        <mspace width="0.25em" />
        <mi>(</mi>
        <mtext>Tier 1 emission factor</mtext>
        <mspace width="0.25em" />
        <mi>(</mi>
        <mi>tCO2e</mi>
        <mspace width="0.25em" />
        <mtext>per ha per year</mtext>
        <mi>)</mi>
        <mo>+</mo>
        <mtext>Tier 1 sequestration factor</mtext>
        <mspace width="0.25em" />
        <mi>(</mi>
        <mi>tCO2e</mi>
        <mspace width="0.25em" />
        <mtext>per ha per year</mtext>
        <mi>)</mi>
      </mrow>
    </Math>
  );
};

const Math4 = () => {
  return (
    <div className="space-y-4">
      <Math>
        <mrow>
          <msub>
            <mtext>Above ground biomass: Carbon reduction AGB</mtext>
            <mi>t</mi>
          </msub>
          <mspace width="0.25em" />
          <mrow>
            <mi>(</mi>
            <mtext>tCO2e in year t</mtext>
            <mi>)</mi>
          </mrow>
          <mo>=</mo>
        </mrow>
        <mrow>
          <msub>
            <mtext>Annual avoided loss (ha in year t)</mtext>
            <mi>t</mi>
          </msub>
        </mrow>
        <mrow>
          <mspace width="0.25em" />
          <mi>x</mi>
          <mtext>Tier 2 AGB emission factor</mtext>
          <mspace width="0.25em" />
          <mi>(</mi>
          <mi>tCO2e</mi>
          <mtext>per ha per year</mtext>
          <mi>)</mi>
        </mrow>
      </Math>
      <Math>
        <mrow>
          <msub>
            <mtext>Soil organic carbon: Carbon reduction SOC</mtext>
            <mi>t</mi>
          </msub>
          <mspace width="0.25em" />
          <mrow>
            <mi>(</mi>
            <mtext>tCO2e in year t</mtext>
            <mi>)</mi>
          </mrow>
          <mo>=</mo>
          <msub>
            <mtext>Cumulative avoided loss (ha)</mtext>
            <mi>t</mi>
          </msub>
          <mspace width="0.25em" />
          <mi>x</mi>
          <mtext>Tier 2 SOC emission factor</mtext>
          <mspace width="0.25em" />
          <mi>(</mi>
          <mi>tCO2e</mi>
          <mtext>per ha per year</mtext>
          <mi>)</mi>
        </mrow>
      </Math>
      <Math>
        <mrow>
          <msub>
            <mtext>Additional sequestration: Additional sequestration</mtext>
            <mi>t</mi>
          </msub>
          <mspace width="0.25em" />
          <mi>(</mi>
          <mtext>tCO2e in year t</mtext>
          <mi>)</mi>
          <mo>=</mo>
          <mtext>Tier 1 sequestration rate</mtext>
          <mspace width="0.25em" />
          <mi>(</mi>
          <mi>tCO2e</mi>
          <mtext>per ha per year</mtext>
          <mi>)</mi>
          <mo>*</mo>
          <msub>
            <mtext>Cumulative avoided loss (ha)</mtext>
            <mi>t</mi>
          </msub>
        </mrow>
      </Math>
    </div>
  );
};

const Math5 = () => {
  return (
    <Math>
      <mrow>
        <msub>
          <mtext>Carbon reduction</mtext>
          <mi>t</mi>
        </msub>
        <mspace width="0.25em" />
        <mi>(</mi>
        <mtext>tCO2e in year t</mtext>
        <mi>)</mi>
        <mo>=</mo>
        <msub>
          <mtext>Carbon reduction AGB</mtext>
          <mi>t</mi>
        </msub>
        <mo>+</mo>
        <msub>
          <mtext>Carbon reduction SOC</mtext>
          <mi>t</mi>
        </msub>
        <mo>+</mo>
        <msub>
          <mtext>Additional sequestration</mtext>
          <mi>t</mi>
        </msub>
      </mrow>
    </Math>
  );
};

const Math6 = () => {
  return (
    <Math>
      <mrow>
        <msub>
          <mtext>Carbon credits</mtext>
          <mi>t</mi>
        </msub>
        <mspace width="0.25em" />
        <mrow>
          <mi>(</mi>
          <mtext>tCO2e in year t</mtext>
          <mi>)</mi>
        </mrow>
        <mo>=</mo>
        <msub>
          <mtext>Carbon reduction</mtext>
          <mi>t</mi>
        </msub>
        <mspace width="0.25em" />
        <mrow>
          <mi>(</mi>
          <mtext>tCO2e in year t</mtext>
          <mi>)</mi>
        </mrow>
        <mo>*</mo>
        <mrow>
          <mi>(</mi>
          <mn>1</mn>
          <mo>-</mo>
          <mtext>buffer (%)</mtext>
          <mi>)</mi>
        </mrow>
      </mrow>
    </Math>
  );
};

const Math7 = () => {
  return (
    <Math>
      <mrow>
        <msub>
          <mtext>Carbon revenue</mtext>
          <mi>t</mi>
        </msub>
        <mspace width="0.25em" />
        <mi>(</mi>
        <mtext>$ in year t</mtext>
        <mi>)</mi>
        <mo>=</mo>
        <msub>
          <mtext>Carbon credits</mtext>
          <mi>t</mi>
        </msub>
        <mspace width="0.25em" />
        <mi>(</mi>
        <mtext>tCO2e in year t</mtext>
        <mi>)</mi>
        <mo>*</mo>
        <mtext>Carbon credit price</mtext>
        <mspace width="0.25em" />
        <mi>(</mi>
        <mi>$/tCO2e</mi>
        <mi>)</mi>
      </mrow>
    </Math>
  );
};

const Math8 = () => {
  return (
    <Math>
      <mrow>
        <msub>
          <mtext>Carbon reduction</mtext>
          <mi>t</mi>
        </msub>
        <mspace width="0.25em" />
        <mi>(</mi>
        <mtext>tCO2e in year t</mtext>
        <mi>)</mi>
        <mo>=</mo>
        <msub>
          <mtext>Restored area (ha)</mtext>
          <mi>t</mi>
        </msub>
        <mspace width="0.25em" />
        <mi>x</mi>
        <mspace width="0.25em" />
        <mtext>Sequestration rate</mtext>
        <mspace width="0.25em" />
        <mi>(</mi>
        <mi>tCO2e / ha / year</mi>
        <mi>)</mi>
        <mspace width="0.25em" />
        <mi>x</mi>
        <mspace width="0.25em" />
        <mi>(</mi>
        <mtext>if planting: planting success rate (%),</mtext>
        <mspace width="0.25em" />
        <mtext>if hydrology</mtext>
        <mo>/</mo>
        <mtext>hybrid: 100%)</mtext>
        <mi>)</mi>
      </mrow>
    </Math>
  );
};

const Math9 = () => {
  return (
    <Math>
      <mrow>
        <msub>
          <mtext>Carbon credits</mtext>
          <mi>t</mi>
        </msub>
        <mspace width="0.25em" />
        <mi>(</mi>
        <mtext>tCO2e in year t</mtext>
        <mi>)</mi>
        <mo>=</mo>
        <msub>
          <mtext>Carbon reduction</mtext>
          <mi>t</mi>
        </msub>
        <mspace width="0.25em" />
        <mi>(</mi>
        <mtext>tCO2e in year t</mtext>
        <mi>)</mi>
        <mo>*</mo>
        <mi>(</mi>
        <mn>1</mn>
        <mo>-</mo>
        <mtext>buffer (%)</mtext>
        <mi>)</mi>
      </mrow>
    </Math>
  );
};

const Math10 = () => {
  return (
    <Math>
      <mrow>
        <msub>
          <mtext>Carbon revenue</mtext>
          <mi>t</mi>
        </msub>
        <mspace width="0.25em" />
        <mi>(</mi>
        <mtext>$ in year t</mtext>
        <mi>)</mi>
        <mo>=</mo>
        <msub>
          <mtext>Carbon credits</mtext>
          <mi>t</mi>
        </msub>
        <mspace width="0.25em" />
        <mi>(</mi>
        <mtext>tCO2e in year t</mtext>
        <mi>)</mi>
        <mo>*</mo>
        <mtext>Carbon credit price</mtext>
        <mspace width="0.25em" />
        <mi>(</mi>
        <mi>$/tCO2e</mi>
        <mi>)</mi>
      </mrow>
    </Math>
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
