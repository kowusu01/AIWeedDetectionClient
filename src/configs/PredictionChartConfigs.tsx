import { type ChartConfig } from "@/components/ui/chart";

// The ChartConfig describes the things like the labels, the colors, for achart.
// So far, I have not been able to get the chart to use the labels from the config,
// but the colors work beautifully.
//
// After the image analysis, an image with marked areas are returned.
// Each detected area is marked using a certain color.
// The api returns the colors so they can be used to create a confidence level chart and a legend for the client.
//
// Here, I create a basi chart config with some default colors,
// After a call to the analysis api, I update the colors and use them to create confidence level chart.
//

export default class ChartConfigManager {
  private chartConfig: ChartConfig;

  constructor() {
    this.chartConfig = {
      Grass: {
        color: "#2563eb",
      },
      Weed: {
        color: "#60a5fa",
      },
    } satisfies ChartConfig;
  }

  getChartConfig(): ChartConfig {
    return this.chartConfig;
  }
  setGrassColor(color: string) {
    this.chartConfig.Grass.color = color;
  }
  setWeedColor(color: string) {
    this.chartConfig.Weed.color = color;
  }
}
