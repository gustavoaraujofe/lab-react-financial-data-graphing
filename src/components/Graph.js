import axios from "axios";
import Chart from "chart.js/auto";
import { useState, useEffect } from "react";
import FilterDate from "./FilterDate";
import MinMax from "./MinMax";

function Graph() {
  const [priceData, setPriceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [chart, setChart] = useState(null);
  const [data, setData] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [link, setLink] = useState(
    "http://api.coindesk.com/v1/bpi/historical/close.json"
  );

  //Altera o link da API de acordo com os dados vindos dos inputs e armazenados na variavel data.
  useEffect(() => {
    if (data !== null) {
      setLink(
        `https://api.coindesk.com/v1/bpi/historical/close.json?start=${data.initialDate}&end=${data.finalDate}&currency=${data.currency}`
      );
      //Seta o loading para true enquanto a informação não chega da API
      setLoading(true);
    }
  }, [data]);

  //Faz as solicitações na API
  useEffect(() => {
    axios
      .get(link)
      .then((response) => {
        setPriceData({ ...response.data.bpi });
        //Seta o loading para false
        setLoading(false);

        //Verifica se data contem alguma informação para atualizar a moeda
        if (data) {
          setCurrency(data.currency);
        }
      })
      .catch((err) => {
        console.log(err);
        //Seta o loading para false
        setLoading(false);
      });
  }, [link]);

  //Responsavel por renderizar o gráfico
  useEffect(() => {
    if (!loading) {
      function renderChart() {
        const ctx = document.getElementById("myCanvas").getContext("2d");

        if (chart) {
          chart.destroy();
        }
        const chartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels: Object.keys(priceData),
            datasets: [
              {
                label: `Preço de fechamento Bitcoin x ${
                  data === null ? "USD" : data.currency
                }`,
                data: Object.values(priceData),
                borderColor: "#2E84E7",
                backgroundColor: "#CFE9FC",
                fill: true,
              },
            ],
          },
        });
        setChart(chartInstance);
      }
      renderChart();
    }
  }, [priceData, loading]);

  return (
    <div>
      <div className="d-flex justify-content-between ">
        <FilterDate setData={setData} />
        <MinMax
          value={Object.values(priceData)}
          currency={data === null ? "USD" : currency}
        />
      </div>
      <div className="mt-5">
        {/* Ternário para o loading */}
        {loading ? (
          <div
            className="text-center d-flex justify-content-center align-items-end"
            style={{ height: "220px" }}
          >
            <div className="spinner-border" role="status"></div>
          </div>
        ) : (
          <canvas id="myCanvas" />
        )}
      </div>
    </div>
  );
}

export default Graph;
