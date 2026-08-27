import { fileURLToPath } from "node:url";

const AFFILIATE_BASE = "https://eduforms.ru";
const RID = "adeaad5a9be53cc5";
const ERID = "2SDnjcsXiW6";
const DEFAULT_SUBID = "promtzilla";

export const slugifyTopic = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/ё/g, "e")
    .replace(/й/g, "j")
    .replace(/х/g, "h")
    .replace(/ц/g, "c")
    .replace(/ч/g, "ch")
    .replace(/ш/g, "sh")
    .replace(/щ/g, "shh")
    .replace(/ю/g, "yu")
    .replace(/я/g, "ya")
    .replace(/[аa]/g, "a")
    .replace(/[бb]/g, "b")
    .replace(/[вv]/g, "v")
    .replace(/[гg]/g, "g")
    .replace(/[дd]/g, "d")
    .replace(/[еe]/g, "e")
    .replace(/[зz]/g, "z")
    .replace(/[иi]/g, "i")
    .replace(/[кk]/g, "k")
    .replace(/[лl]/g, "l")
    .replace(/[мm]/g, "m")
    .replace(/[нn]/g, "n")
    .replace(/[оo]/g, "o")
    .replace(/[пp]/g, "p")
    .replace(/[рr]/g, "r")
    .replace(/[сs]/g, "s")
    .replace(/[тt]/g, "t")
    .replace(/[уu]/g, "u")
    .replace(/[фf]/g, "f")
    .replace(/[ы]/g, "y")
    .replace(/[э]/g, "e")
    .replace(/[ъь]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);

export const makeAffiliateLink = ({ targetUrl, topicTheme, subid = DEFAULT_SUBID }) => {
  const url = new URL(AFFILIATE_BASE);
  url.searchParams.set("rid", RID);
  url.searchParams.set("erid", ERID);
  url.searchParams.set("ulp", targetUrl);
  url.searchParams.set("subid", subid);
  url.searchParams.set("subid2", slugifyTopic(topicTheme));
  return url.toString();
};

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const [, , targetUrl, ...topicParts] = process.argv;
  const topicTheme = topicParts.join(" ");

  if (!targetUrl || !topicTheme) {
    console.error("Usage: node scripts/affiliate-link.mjs <target-url> <topic theme>");
    process.exit(1);
  }

  console.log(makeAffiliateLink({ targetUrl, topicTheme }));
}
