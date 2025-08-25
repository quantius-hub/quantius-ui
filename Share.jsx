import { h } from "preact";
import {
  FaXTwitter,
  FaYoutube,
  FaFacebookF,
  FaLinkedinIn,
  FaPinterestP,
  FaRedditAlien,
  FaWhatsapp,
  FaDiscord,
  FaGithub,
  FaInstagram,
} from "react-icons/fa6";
import { SiHuggingface, SiSoundcloud } from "react-icons/si";

const platformIcons = {
  x: FaXTwitter,
  youtube: FaYoutube,
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  pinterest: FaPinterestP,
  reddit: FaRedditAlien,
  whatsapp: FaWhatsapp,
  discord: FaDiscord,
  github: FaGithub,
  huggingface: SiHuggingface,
  soundcloud: SiSoundcloud,
};

const brandPalette = {
  x: { bg: "#000000", fg: "#ffffff" },
  youtube: { bg: "#FF0000", fg: "#ffffff" },
  facebook: { bg: "#1877F2", fg: "#ffffff" },
  instagram: { bg: "#E4405F", fg: "#ffffff" }, // Solid Instagram color
  linkedin: { bg: "#0A66C2", fg: "#ffffff" },
  pinterest: { bg: "#E60023", fg: "#ffffff" },
  reddit: { bg: "#FF4500", fg: "#ffffff" },
  whatsapp: { bg: "#25D366", fg: "#ffffff" },
  discord: { bg: "#5865F2", fg: "#ffffff" },
  github: { bg: "#181717", fg: "#ffffff" },
  huggingface: { bg: "#FFE082", fg: "#000000" },
  soundcloud: { bg: "#FF5500", fg: "#ffffff" },
};

const platformDomains = {
  x: ["twitter.com", "x.com"],
  youtube: ["youtube.com"],
  facebook: ["facebook.com"],
  instagram: ["instagram.com"],
  linkedin: ["linkedin.com"],
  pinterest: ["pinterest.com"],
  reddit: ["reddit.com"],
  whatsapp: ["wa.me"],
  discord: ["discord.gg", "discord.com"],
  github: ["github.com"],
  huggingface: ["huggingface.co"],
  soundcloud: ["soundcloud.com", "on.soundcloud.com"],
};

const detectPlatform = (url) => {
  try {
    const host = new URL(url).hostname.toLowerCase();
    for (const [platform, domains] of Object.entries(platformDomains)) {
      if (domains.some((d) => host.includes(d))) return platform;
    }
  } catch (e) {
    console.error("Invalid URL", url);
  }
  return null;
};

export const ShareButton = ({
  platform,
  link,
  size = 40,
  mode = "color",
  background = "#fff",
  color = "#000",
  borderRadius = "8px",
  iconSize = "60%",
  colorIconSrc = {},
}) => {
  const Icon = platformIcons[platform];
  if (!Icon) return null;

  const brand = brandPalette[platform] || {};
  const isColor = mode === "color";
  const finalBg = isColor ? brand.bg ?? background : background;
  const finalFg = isColor ? brand.fg ?? color : color;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        background: finalBg,
        color: finalFg,
        borderRadius,
        textDecoration: "none",
      }}
      aria-label={platform}
      title={platform}
    >
      {isColor && colorIconSrc[platform] ? (
        <img
          src={colorIconSrc[platform]}
          alt=""
          style={{ width: iconSize, height: iconSize, objectFit: "contain" }}
        />
      ) : (
        <Icon style={{ width: iconSize, height: iconSize }} />
      )}
    </a>
  );
};

export const ShareBarFromUrls = ({
  urls = [],
  size = 40,
  gap = "10px",
  mode = "color",
  background = "#fff",
  color = "#000",
  borderRadius = "8px",
  iconSize = "60%",
  colorIconSrc = {},
}) => {
  const items = urls
    .map((url) => ({ platform: detectPlatform(url), link: url }))
    .filter((item) => item.platform);

  return (
    <div style={{ display: "flex", gap, flexWrap: "wrap" }}>
      {items.map(({ platform, link }, idx) => (
        <ShareButton
          key={idx}
          platform={platform}
          link={link}
          size={size}
          mode={mode}
          background={background}
          color={color}
          borderRadius={borderRadius}
          iconSize={iconSize}
          colorIconSrc={colorIconSrc}
        />
      ))}
    </div>
  );
};