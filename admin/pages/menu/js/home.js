if (token) {
  (async () => {
    const getData = await app.postData(`${base_url_api}/dashboard/index`);
    console.log(getData);
    let seriesData = [];
    const { listKategori } = getData.data;
    for (const key of listKategori) {
      const { name, total } = key;
      seriesData.push({
        name: name,
        y: total,
      });
    }
    console.log(seriesData);
    let paramChart = {
      name: "Grafik Master Buku",
      data: seriesData,
    };
    console.log(paramChart);
    await app.setChart("bar", "chart1", paramChart);
  })();
}
