export async function getMarineForecast(
  lat,
  lng
) {

  try {

    const url =
      `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&hourly=wave_height,wave_direction,wave_period,wind_wave_height,swell_wave_height,swell_wave_direction&timezone=auto`;

    const response =
      await fetch(url, {
        next: {
          revalidate: 3600
        }
      });

    const data =
      await response.json();

    console.log(
      "FORECAST API:",
      data
    );

    return data;

  } catch (error) {

    console.error(
      "Erro forecast:",
      error
    );

    return null;
  }
}