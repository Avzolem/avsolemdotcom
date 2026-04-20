/* Decorative color orbs behind the bento grid so backdrop-blur has something to do.
 * Fixed position, pointer-events:none, very slow pulse. */
export function AmbientOrbs() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Cyan top-left */}
      <div
        className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full
          bg-cyan-400/30 dark:bg-cyan-500/15
          blur-[140px] animate-orb-float-1"
      />
      {/* Orange bottom-right */}
      <div
        className="absolute -bottom-40 -right-32 w-[480px] h-[480px] rounded-full
          bg-orange-400/30 dark:bg-orange-500/15
          blur-[140px] animate-orb-float-2"
      />
      {/* Violet mid */}
      <div
        className="absolute top-[40%] left-[45%] w-[360px] h-[360px] rounded-full
          bg-violet-400/25 dark:bg-violet-500/12
          blur-[120px] animate-orb-float-3"
      />
    </div>
  );
}
