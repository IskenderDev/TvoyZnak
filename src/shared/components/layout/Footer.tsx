export function Footer() {
  return (
    <footer className="bg-zinc-950 py-6 text-sm text-zinc-500">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6 lg:px-8">
        <span>&copy; {new Date().getFullYear()} TvoyZnak. Все права защищены.</span>
        <span>admin@admin.admin</span>
      </div>
    </footer>
  );
}

export default Footer;
