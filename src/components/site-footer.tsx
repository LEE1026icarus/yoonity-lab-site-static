export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-ink-muted md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-black text-ink">yoonity</p>
          <p className="mt-1">동국대학교 경영정보학과 Yoonity 연구실</p>
        </div>
        <div className="flex flex-col gap-1 md:items-end">
          <a
            href="mailto:koreatechbigdatalab@gmail.com"
            className="transition-colors hover:text-ink"
          >
            koreatechbigdatalab@gmail.com
          </a>
          <p>&copy; {year} Yoonity Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
