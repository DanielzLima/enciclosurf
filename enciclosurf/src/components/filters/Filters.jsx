export default function Filters({
  filterDifficulty,
  setFilterDifficulty,
  filterCountry,
  setFilterCountry
}) {
  return (
    <div className="filters">

      <select onChange={(e) => setFilterDifficulty(e.target.value)}>
        <option value="todos">Todas dificuldades</option>
        <option value="iniciante">Iniciante</option>
        <option value="intermediario">Intermediário</option>
        <option value="avancado">Avançado</option>
      </select>

      <select onChange={(e) => setFilterCountry(e.target.value)}>
        <option value="todos">Todos países</option>
        <option value="Brasil">Brasil</option>
        <option value="Portugal">Portugal</option>
        <option value="EUA">EUA</option>
      </select>

    </div>
  );
}