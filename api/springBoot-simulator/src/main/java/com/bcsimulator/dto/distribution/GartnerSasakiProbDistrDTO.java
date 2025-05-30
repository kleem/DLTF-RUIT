package com.bcsimulator.dto.distribution;

import com.bcsimulator.dto.AbstractDistributionDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GartnerSasakiProbDistrDTO extends AbstractDistributionDTO {

    @JsonProperty("A")
    private double A;
    @JsonProperty("B")
    private double B;
    @JsonProperty("C")
    private double C;
    @JsonProperty("D")
    private double D;
    @JsonProperty("E")
    private double E;
    @JsonProperty("F")
    private double F;
    @JsonProperty("scalingFactor")
    private double scalingFactor;


    @Override
    public double getProb(int time) {
        double t = time * scalingFactor;
        double peak = A * Math.exp(-B * Math.exp(-C * t));
        double trough = D / (1 + Math.exp(-E * (t - F)));
        return Math.max(peak - trough, 0);
    }
}