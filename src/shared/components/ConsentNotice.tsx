type ConsentNoticeProps = {
  className?: string
}

export default function ConsentNotice({ className }: ConsentNoticeProps) {
  const baseClasses =
    "text-xs leading-relaxed text-[#6B7280] md:text-[13px]" + (className ? ` ${className}` : "")

  return (
    <p className={baseClasses}>
      Нажимая на кнопку, вы даёте согласие на обработку
      {" "}
      <a
        href="/personal-data-policy.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white font-semibold underline-offset-4 transition hover:underline"
      >
        персональных данных
      </a>
      {" "}
      и соглашаетесь с
      {" "}
      <a
        href="/privacy-policy.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white font-semibold underline-offset-4 transition hover:underline"
      >
        политикой конфиденциальности
      </a>
      .
    </p>
  )
}
