"use client"

import { motion } from "framer-motion"

export function Marquee() {
  return (
    <div className="overflow-hidden py-5 mb-8 bg-green-100/50 rounded-3xl">
      <motion.div
        className="whitespace-nowrap inline-flex"
        animate={{ x: ["0%", "50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <p className="text-lg font-bold text-green-800 px-6 inline-block">
          صدقه جاريه لامي حبيبتي هاله محمد بارك الله ف عمرها وصحتها وحفظها من كل سوء وجعلها من أهل رحمته...
        </p>
        <p className="text-lg font-bold text-green-800 px-6 inline-block">
          صدقه جاريه لامي حبيبتي هاله محمد بارك الله ف عمرها وصحتها وحفظها من كل سوء وجعلها من أهل رحمته...
        </p>
      </motion.div>
    </div>
  )
}