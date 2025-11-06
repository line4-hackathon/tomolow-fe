import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function TestChart() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const chart = createChart(ref.current, {
      width: ref.current.clientWidth,
      height: 550,
      layout: {
        backgroundColor: "#ffffff",
        textColor: "#222",
      },
      grid: {
        vertLines: { color: "#f1f3f6" },
        horzLines: { color: "#f1f3f6" },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#d60000",
      downColor: "#0051c7",
      wickUpColor: "#d60000",
      wickDownColor: "#0051c7",
      borderUpColor: "#d60000",
      borderDownColor: "#0051c7",
      borderVisible: true,
    });

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "",
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    const ma5 = chart.addLineSeries({
      color: "#ff9900",
      lineWidth: 2,
      title: "MA5",
    });
    const ma20 = chart.addLineSeries({
      color: "#009900",
      lineWidth: 2,
      title: "MA20",
    });

    // 샘플 데이터 (임시)
    const data = [
      { time: 1730706000, open: 100, high: 105, low: 95, close: 102, volume: 5000 },
      { time: 1730792400, open: 102, high: 108, low: 101, close: 107, volume: 7000 },
      { time: 1730878800, open: 107, high: 109, low: 103, close: 105, volume: 6000 },
      { time: 1730965200, open: 105, high: 106, low: 98, close: 99, volume: 9000 },
      { time: 1731051600, open: 99, high: 103, low: 97, close: 101, volume: 7500 },
    ];

    candleSeries.setData(data);
    volumeSeries.setData(
      data.map((d) => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open ? "#d60000" : "#0051c7",
      }))
    );

    // 이동평균선 계산
    const calcMA = (arr, n) =>
      arr.map((_, i) => {
        if (i < n - 1) return { time: arr[i].time, value: null };
        const slice = arr.slice(i - n + 1, i + 1);
        const avg = slice.reduce((sum, val) => sum + val.close, 0) / slice.length;
        return { time: arr[i].time, value: avg };
      });

    ma5.setData(calcMA(data, 5));
    ma20.setData(calcMA(data, 20));

    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({ width: ref.current.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "550px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    />
  );
}
