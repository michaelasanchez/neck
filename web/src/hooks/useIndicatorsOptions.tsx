import { useState } from "react";
import { IndicatorsOptions } from "../shared/IndicatorsOptions";

export const useIndicatorsOptions = () => {
  const [indicatorsOptions, setIndicatorsOptions] = useState<IndicatorsOptions>({
    searchArray: []
  })

  return { ...indicatorsOptions, setIndicatorsOptions };
};
