// A teaser octopus for RaJA Advance (not the company logo, which doesn't
// exist yet): it hides below the band's bottom edge, peeks up to eye level,
// rises with two tentacle hands gripping the edge, looks left and right with
// a curious tilt, blinks, then ducks back down. One 8s loop, transform and
// opacity only; frozen in the full-peek pose under prefers-reduced-motion.
// The parent must clip (overflow: hidden) at the edge it peeks over.

const BODY = "#E07A9A";
const SHADE = "#C95F86";
const SPOT = "#F2A9C0";
const EYE = "#FFFDF6";
const INK = "#20233A";
const BLUSH = "#F8C9D6";

export function PeekingOctopus({ className = "" }: { className?: string }) {
  return (
    <div className={`po-peek ${className}`} aria-hidden>
      <style>{CSS}</style>
      <svg viewBox="0 0 200 200" className="block h-full w-full overflow-visible">
        <g className="po-tilt">
          {/* head: one soft dome that runs off the bottom of the frame */}
          <path fill={SHADE} d="M30,206 C26,176 18,120 36,86 C52,56 76,46 102,46 C130,46 154,58 168,88 C184,122 176,176 172,206 Z" transform="translate(4,3)" />
          <path fill={BODY} d="M28,206 C24,176 16,120 34,86 C50,56 74,44 100,44 C128,44 152,56 166,86 C182,120 174,176 170,206 Z" />
          {/* spots, uneven like a real octopus */}
          <path fill={SPOT} d="M66,86 c6,-5 15,-3 15,4 c0,7 -11,10 -15,5 c-2,-3 -2,-6 0,-9 Z" />
          <path fill={SPOT} d="M122,74 c4,-3 10,-2 10,3 c0,5 -7,7 -10,4 c-2,-2 -2,-5 0,-7 Z" />
          <path fill={SPOT} d="M136,104 c5,-3 11,0 10,5 c-1,5 -8,6 -11,3 c-2,-2 -1,-6 1,-8 Z" />
          <path fill={SPOT} d="M86,66 c3,-2 7,-1 7,2 c0,3 -5,5 -7,3 c-1,-1 -1,-4 0,-5 Z" />

          {/* eyes: whites, pupils that look around, lids that blink */}
          <g className="po-eye">
            <path fill={EYE} d="M62,118 c0,-13 9,-22 20,-22 c11,0 19,9 19,22 c0,13 -8,21 -19,21 c-11,0 -20,-8 -20,-21 Z" />
            <path fill={EYE} d="M105,118 c0,-13 8,-22 19,-22 c11,0 20,9 20,22 c0,13 -9,21 -20,21 c-11,0 -19,-8 -19,-21 Z" />
            <g className="po-look">
              <path fill={INK} d="M74,121 c0,-6 4,-10 8,-10 c5,0 8,4 8,10 c0,6 -3,9 -8,9 c-4,0 -8,-3 -8,-9 Z" />
              <path fill={INK} d="M116,121 c0,-6 3,-10 8,-10 c4,0 8,4 8,10 c0,6 -4,9 -8,9 c-5,0 -8,-3 -8,-9 Z" />
              <path fill={EYE} d="M79,116 c1,-2 4,-2 4,0 c0,2 -3,3 -4,1 Z" />
              <path fill={EYE} d="M121,116 c1,-2 4,-2 4,0 c0,2 -3,3 -4,1 Z" />
            </g>
          </g>
          {/* blush ovals and a tiny smile */}
          <ellipse cx="60" cy="146" rx="10" ry="5.5" fill={BLUSH} />
          <ellipse cx="146" cy="146" rx="10" ry="5.5" fill={BLUSH} />
          <path d="M94,151 q6,6 12,0" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>

        {/* tentacle hands gripping the edge, curled at the tips */}
        <g className="po-hand po-hand-l">
          <path fill={BODY} d="M18,206 C14,186 18,170 30,166 C42,162 50,170 46,178 C43,184 36,183 35,178 C34,174 30,176 30,182 C30,192 34,200 38,206 Z" />
          <path fill={SPOT} d="M27,190 c2,-1 4,0 4,2 c0,2 -3,3 -4,1 c-1,-1 -1,-2 0,-3 Z" />
        </g>
        <g className="po-hand po-hand-r">
          <path fill={BODY} d="M182,206 C186,186 182,170 170,166 C158,162 150,170 154,178 C157,184 164,183 165,178 C166,174 170,176 170,182 C170,192 166,200 162,206 Z" />
          <path fill={SPOT} d="M171,190 c2,-1 4,0 4,2 c0,2 -3,3 -4,1 c-1,-1 -1,-2 0,-3 Z" />
        </g>
      </svg>
    </div>
  );
}

const CSS = `
.po-peek{animation:po-peek 8s cubic-bezier(.45,0,.25,1) infinite;transform:translateY(100%)}
.po-peek svg g{transform-box:fill-box}
@keyframes po-peek{
  0%,8%{transform:translateY(100%)}
  20%,30%{transform:translateY(46%)}
  42%,74%{transform:translateY(4%)}
  84%{transform:translateY(46%)}
  94%,100%{transform:translateY(100%)}
}
.po-tilt{transform-origin:50% 100%;animation:po-tilt 8s ease-in-out infinite}
@keyframes po-tilt{0%,44%{transform:rotate(0)}52%,60%{transform:rotate(-5deg)}66%,100%{transform:rotate(0)}}
.po-look{animation:po-look 8s ease-in-out infinite}
@keyframes po-look{0%,22%{transform:translateX(0)}26%,30%{transform:translate(-5px,2px)}46%,52%{transform:translateX(-6px)}58%,64%{transform:translateX(6px)}70%,100%{transform:translateX(0)}}
.po-eye{transform-origin:50% 55%;animation:po-blink 8s infinite}
@keyframes po-blink{0%,66%,69.5%,100%{transform:scaleY(1)}67.6%{transform:scaleY(.1)}}
.po-hand{transform-origin:50% 100%;animation:po-hand 8s ease-in-out infinite}
.po-hand-r{animation-delay:-.35s}
@keyframes po-hand{0%,40%{transform:translateY(30px)}46%,72%{transform:translateY(0) rotate(-3deg)}58%{transform:translateY(-2px) rotate(3deg)}80%,100%{transform:translateY(30px)}}
@media (prefers-reduced-motion:reduce){
  .po-peek,.po-peek *{animation:none!important}
  .po-peek{transform:translateY(4%)}
  .po-hand{transform:none}
}
`;
