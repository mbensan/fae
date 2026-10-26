export const ui = {
  skip:
    "absolute left-4 top-[-4rem] z-[100] rounded-xl bg-[#063B78] px-4 py-3 font-bold text-white no-underline focus:top-3",
  shell: "relative mx-auto flex min-h-dvh max-w-[30rem] flex-col bg-white shadow-float",
  header:
    "sticky top-0 z-20 flex min-h-[4.25rem] shrink-0 items-center gap-2 bg-white/90 px-4 py-3 backdrop-blur",
  headerMissions:
    "sticky top-0 z-20 flex min-h-[4.25rem] shrink-0 items-center gap-2 bg-white/80 px-4 py-3 backdrop-blur",
  headerHome: "sticky top-0 z-20 flex min-h-[4.25rem] shrink-0 items-center justify-between gap-3 bg-[#f4fbff] px-4 py-3",
  iconBtn:
    "inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#063B78] shadow-[0_2px_10px_rgb(6_59_120_/_14%)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]",
  brand: "grid justify-items-start no-underline font-display font-extrabold leading-none",
  brandDesafio: "text-[1.35rem] tracking-wide text-[#063B78]",
  brandAcoge: "-mt-0.5 text-[1.7rem] tracking-wider text-[#FF7800]",
  brandDesafioSm: "text-[0.95rem] tracking-wide text-[#063B78]",
  brandAcogeSm: "-mt-0.5 text-[1.2rem] tracking-wider text-[#FF7800]",
  points:
    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-[#D8DEE6] bg-white px-4 py-2 font-bold text-[#0B376B] shadow-[0_10px_30px_rgb(6_59_120_/_12%)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]",
  avatar: "h-11 w-11 overflow-hidden rounded-full bg-[#d7ecff] shadow-[0_0_0_3px_#fff,0_0_0_5px_#cfe6ff]",
  nav: "sticky bottom-0 z-30 mt-auto grid grid-cols-5 gap-1 rounded-t-[2rem] bg-white px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgb(6_59_120_/_8%)]",
  navItem:
    "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-medium text-[#718096] no-underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]",
  navItemActive: "font-bold text-[#063B78] shadow-[inset_0_-3px_0_#063B78]",
  screen: "grid gap-5 px-5 pb-28 pt-5",
  screenActivity: "grid gap-5 bg-gradient-to-b from-[#f7fbff] to-white px-5 pb-8 pt-5",
  card: "rounded-[1.25rem] border border-[#D8DEE6] bg-white shadow-[0_10px_30px_rgb(6_59_120_/_12%)]",
  btn: "inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-3 font-extrabold no-underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED] disabled:cursor-not-allowed disabled:bg-[#D8DEE6] disabled:text-[#52677F] disabled:shadow-none",
  btnPrimary: "bg-[#063B78] text-white",
  btnSecondary: "border-2 border-[#07559A] bg-white text-[#063B78]",
  btnReward: "w-auto min-h-10 bg-[#FF7800] px-4 text-white",
  btnGhost: "w-auto min-h-10 border-2 border-[#FF7800] bg-transparent text-[#FF7800]",
  btnDanger: "bg-[#DC3545] text-white",
  btnDisabled: "cursor-not-allowed bg-[#D8DEE6] text-[#52677F] shadow-none",
  progress: "progress-bar h-2.5 w-full overflow-hidden rounded-full border-0 bg-[#e6edf4]",
  eyebrow: "m-0 text-sm font-medium text-[#52677F]",
  toast:
    "pointer-events-none fixed inset-x-0 bottom-24 z-40 grid justify-items-center",
  toastInner: "m-3 max-w-sm rounded-full bg-[#063B78] px-5 py-3 font-bold text-white shadow-[0_16px_40px_rgb(6_59_120_/_18%)]",
  dialog:
    "w-[min(22rem,calc(100%-2rem))] rounded-[1.25rem] border-0 bg-white p-6 text-[#0B376B] shadow-[0_16px_40px_rgb(6_59_120_/_18%)]",
  dialogActions: "mt-6 grid gap-3",
  chip: "min-h-10 shrink-0 rounded-full border border-[#D8DEE6] bg-white px-4 py-2 text-sm font-bold text-[#52677F] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]",
  chipOn: "border-[#063B78] bg-[#063B78] text-white",
  option:
    "grid min-h-[3.4rem] cursor-pointer grid-cols-[2.4rem_1fr] items-center gap-3 rounded-[2rem] border-[1.5px] border-[#D8DEE6] bg-white px-4 py-3 has-[:checked]:border-[#07559A] has-[:checked]:bg-[#f3f8ff] has-[:checked]:shadow-[0_0_0_3px_rgb(8_120_190_/_12%)] has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#7C3AED] hover:border-[#0878BE]",
  optionMark: "grid h-[2.1rem] w-[2.1rem] place-items-center rounded-full bg-[#eef3f8] font-extrabold text-[#063B78]",
  offline: "mx-5 rounded-xl bg-[#fff4d6] px-4 py-3 text-sm font-semibold text-[#0B376B]"
};

export function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}
