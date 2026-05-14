import { Link } from 'react-router-dom';

function Categories() {
  const categories = ['Educação', 'Infantil', 'Literatura', 'Religião', 'Tecnologia'];

  const ageGroups = [
    { label: 'Infantil (0 - 12)', value: 'Infantil' },
    { label: 'Juvenil (13 - 17)', value: 'Juvenil' },
    { label: 'Adulto (18 - acima)', value: 'Adulto' },
  ];

  return (
    <main className="container">
      <h2>Categorias e Faixas Etárias</h2>

      <section className="category-box">
        <h3>Categorias</h3>
        <ul>
          {categories.map((category) => (
            <li key={category}>
              <Link to={`/?categoria=${encodeURIComponent(category)}`}>
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="category-box">
        <h3>Faixas etárias</h3>
        <ul>
          {ageGroups.map((ageGroup) => (
            <li key={ageGroup.value}>
              <Link to={`/?idade=${encodeURIComponent(ageGroup.value)}`}>
                {ageGroup.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Categories;