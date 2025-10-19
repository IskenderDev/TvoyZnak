import { LuPhone, LuMail } from "react-icons/lu"
import { FaVk, FaTelegramPlane, FaWhatsapp } from "react-icons/fa"

export default function ContactChannels() {
  return (
    <div className="grid gap-4 sm:gap-5 content-start">
      <ChannelRow
        icon={<LuPhone className="w-5 h-5" aria-hidden />}
        label="+7 (995) 920-20-90"
        href="tel:+79959202090"
      />

      <ChannelRow
        icon={<LuMail className="w-5 h-5" aria-hidden />}
        label="znakonet@yandex.ru"
        href="mailto:znakonet@yandex.ru"
      />

      <div className="flex items-center gap-3 pt-1">
        <SocialIcon
          label="VK"
          href="https://vk.com/tvoyznak"
          icon={<FaVk className="w-5 h-5" aria-hidden />}
        />
        <SocialIcon
          label="TG"
          href="https://t.me/tvoyznak"
          icon={<FaTelegramPlane className="w-5 h-5" aria-hidden />}
        />
        <SocialIcon
          label="WA"
          href="https://wa.me/79959202090"
          icon={<FaWhatsapp className="w-5 h-5" aria-hidden />}
        />
      </div>
    </div>
  )
}

function ChannelRow({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode
  label: string
  href: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary-500 text-primary-foreground">
        {icon}
      </span>
      <a
        href={href}
        className="text-[15px] sm:text-base font-medium transition-colors hover:text-primary-500"
      >
        {label}
      </a>
    </div>
  )
}

function SocialIcon({
  label,
  href,
  icon,
}: {
  label: string
  href: string
  icon: React.ReactNode
}) {
  return (
    <a
      aria-label={label}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex size-10 items-center justify-center rounded-lg bg-primary-500 text-primary-foreground transition hover:brightness-95"
      title={label}
    >
      {icon}
    </a>
  )
}
