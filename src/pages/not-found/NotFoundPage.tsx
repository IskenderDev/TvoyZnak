import PageTitle from "@/shared/components/PageTitle";
import { Link } from "react-router-dom";
import { paths } from "@/shared/routes/paths";
import Seo from "@/shared/components/Seo";

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Страница не найдена — Знак отличия" description="404 Not Found." />
      <PageTitle>Страница не найдена</PageTitle>
      <p className="mb-4">Запрошенная страница не существует.</p>
      <Link to={paths.home} className="underline">На главную</Link>
    </>
  );
}
