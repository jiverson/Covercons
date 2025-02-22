import React from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ChromePicker, CirclePicker } from "react-color";
import { motion, AnimatePresence } from "framer-motion";
import { shadeColor } from "../lib/shadeColor";
import useWindowSize from "../lib/winsizehook";
import { getRegFromString } from "../lib/getRegFromString";
import SVGToImage from "../lib/SVGToImage";
import IconSearch from "../components/IconSearch";

import {
  AnglePicker,
  GradientPicker,
  getGradientPreview,
} from "react-linear-gradient-picker";

export default function Home() {
  // REF TO CREATE A TAG FOR DOWNLOAD SVG
  const downloadHelper_a_tag = React.useRef();

  // USED TO GET THE WINDOW SIZE
  const [width] = useWindowSize();

  // APPLICATION STATE
  const [svg, setSvg] = React.useState(null);
  const [coverType, setCoverType] = React.useState("singlemiddleicon");
  const [generatedCoverSvg, setGeneratedCoverSvg] = React.useState("");
  const [iconPatternSpacing, setIconPatternSpacing] = React.useState(25);
  const [iconPatternSize, setIconPatternSize] = React.useState(2);
  const [iconPatternRotation, setIconPatternRotation] = React.useState(330);
  const [iconPatternShade, setIconPatternShade] = React.useState(-25);
  const [showAdvancedSettings, setShowAdvancedSettings] = React.useState(false);
  const [selectedIconName, setSelectedIconName] = React.useState("rocket");
  const [selectedIconVersion, setSelectedIconVersion] = React.useState(1);
  const [selectedIconType, setSelectedIconType] =
    React.useState("materialicons");

  const initialPallet = [{ offset: "1.00", color: "rgb(58, 148, 255)" }];
  const [angle, setAngle] = React.useState(90);
  const [palette, setPalette] = React.useState(initialPallet);
  const { gradient } = getGradientPreview(palette, angle);
  const rgbToRgba = (rgb, a = 1) =>
    rgb.replace("rgb(", "rgba(").replace(")", `, ${a})`);

  const onAngleInputChange = (angle) => {
    angle = angle > 360 ? angle - 360 : angle;
    angle = angle < 0 ? angle + 360 : angle;

    setAngle(angle);
  };

  // STORES COLOR OF ICON FROM BACKGROUND COLOR
  const iconColor = React.useMemo(() => {
    return "#ffffffaf";
  });

  // GET THE ICON FROM GOOGLE FONTS AND STORE IT IN SVG STATE
  React.useEffect(() => {
    fetch(
      `https://fonts.gstatic.com/s/i/${selectedIconType}/${selectedIconName}/v${selectedIconVersion}/24px.svg`
    )
      .then((res) => res.text())
      .then((b) => setSvg(b))
      .catch((err) => console.log(err));
  }, [selectedIconName, selectedIconVersion, selectedIconType]);

  // GENERATE COMPLETE SVG WITH BACKGROUND FROM ICON
  React.useEffect(() => {
    // CLEAN THE FETCHED SVG (MOST OF THE ICON BUGS CAN BE SOLVED HERE)
    let cleanedSvg = (color) => {
      return svg
        .substring(svg.indexOf(">") + 1, svg.length - 6)
        .replaceAll('<rect fill="none" height="24" width="24"/>', "")
        .replaceAll("<path", `<path fill="${color}"`)
        .replaceAll("<rect", `<rect fill="${color}"`)
        .replaceAll("<circle", `<circle fill="${color}"`)
        .replaceAll("<polygon", `<polygon fill="${color}"`)
        .replace(new RegExp(/<(.*?)(fill="none")(.*?)>/), "")
        .replace(
          getRegFromString(
            `/(<(.*?)fill='${color}')(.*?)(fill="none")(.*?)(>)/`
          ),
          ""
        )
        .replaceAll("<g>", "")
        .replaceAll("</g>", "");
    };

    const stops = palette.reduce(
      (acc, { offset, color, opacity = 1 }) =>
        `${acc}<stop offset="${offset}" style="stop-color:${color};stop-opacity:${opacity}" />`,
      ""
    );

    // FOR COVER TYPE - ICON PATTERN
    if (coverType == "iconpattern" && svg) {
      setGeneratedCoverSvg(
        `<svg version="1.1"
        baseProfile="full"
        width="1500" height="600"
        viewbox="0 0 1500 600"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="url(#gradient)"/>
        <rect width="100%" height="100%" fill="url(#pattern)"/>
        <defs>
          <linearGradient id="gradient" x1="${gradient.x1}" y1="${
          gradient.y1
        }" x2="${gradient.x2}" y2="${gradient.y2}">
            ${stops}
          </linearGradient>
          <pattern id="pattern" x="0" y="0" \
           width="${iconPatternSpacing}" \
           height="${iconPatternSpacing}" \
           patternTransform="rotate(${iconPatternRotation}) \
           scale(${iconPatternSize})" \
           patternUnits="userSpaceOnUse">
              <g>
                ${cleanedSvg(
                  shadeColor(iconColor.substring(1), parseInt(iconPatternShade))
                )}
              </g>
          </pattern>
        </defs>
      </svg>
      `
      );
    }

    // FOR COVER TYPE - SINGLE MIDDLE ICON
    else if (coverType == "singlemiddleicon" && svg) {
      // GENERATE COVER WITH BACKGROUND IMAGE WITH REPLACED SVG
      setGeneratedCoverSvg(
        `<svg version="1.1"
          baseProfile="full"
          viewbox="0 0 1500 600"
          width="1500" height="600"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg">
          <defs>
          <linearGradient id="gradient" x1="${gradient.x1}" y1="${
          gradient.y1
        }" x2="${gradient.x2}" y2="${gradient.y2}">
          ${stops}
          </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#gradient)" />
          <g transform="translate(610, 180) scale(10)" id="center_icon">${cleanedSvg(
            iconColor
          )}</g>
         </svg>`
      );
    }

    // FOR COVER TYPE - NO ICON
    else if (coverType == "noicon" && svg) {
      // GENERATE COVER WITH BACKGROUND IMAGE WITH REPLACED SVG
      setGeneratedCoverSvg(
        `<svg version="1.1"
          baseProfile="full"
          viewbox="0 0 1500 600"
          width="1500" height="600"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg">
          <defs>
          <linearGradient id="gradient" x1="${gradient.x1}" y1="${gradient.y1}" x2="${gradient.x2}" y2="${gradient.y2}">
          ${stops}
          </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#gradient)" />
         </svg>`
      );
    }
  }, [
    angle,
    gradient,
    palette,
    iconColor,
    coverType,
    svg,
    iconPatternSpacing,
    iconPatternSize,
    iconPatternRotation,
    iconPatternShade,
  ]);

  // WHEN DOWNLOAD SVG BUTTON IS CLICKED, CREATE A NEW BLOB AND DOWNLOAD IT
  const handleDownloadSvg = () => {
    let blob = new Blob([generatedCoverSvg]);
    downloadHelper_a_tag.current.download = `covercon_${selectedIconName}_${coverType}.svg`;
    downloadHelper_a_tag.current.href = window.URL.createObjectURL(blob);
    downloadHelper_a_tag.current.click();
  };

  // WHEN DOWNLOAD PNG BUTTON IS CLICKED, CREATE A NEW BLOB AND DOWNLOAD IT
  const handleDownloadPng = async () => {
    SVGToImage({
      svg: generatedCoverSvg,
      mimetype: "image/png",
      width: 3000,
      height: 1200,
      quality: 1,
      outputFormat: "blob",
    })
      .then(function (blob) {
        downloadHelper_a_tag.current.download = `covercon_${selectedIconName}_${coverType}.png`;
        downloadHelper_a_tag.current.href = window.URL.createObjectURL(blob);
        downloadHelper_a_tag.current.click();
      })
      .catch(function (err) {
        alert(err);
      });
  };

  const WrappedChromePicker = ({ onSelect, ...rest }) => {
    return (
      <ChromePicker
        {...rest}
        color={rgbToRgba(rest.color, rest.opacity)}
        onChange={(c) => {
          const { r, g, b, a } = c.rgb;
          onSelect(`rgb(${r}, ${g}, ${b})`, a);
        }}
      />
    );
  };

  return (
    <>
      <Head>
        {/* <!-- HTML Meta Tags --> */}
        <title>Covercons</title>
        <meta name="description" content="Generate Beautiful Notion Covers" />
        <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
        <meta name="theme-color" content="#222222" />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://covercons.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Covercons" />
        <meta
          property="og:description"
          content="Generate beautiful cover images for Notion Pages, Blogs, and more"
        />
        <meta property="og:image" content="/og-image.png" />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="covercons.vercel.app" />
        <meta property="twitter:url" content="https://covercons.vercel.app/" />
        <meta name="twitter:title" content="Covercons" />
        <meta
          name="twitter:description"
          content="Generate beautiful cover images for Notion Pages, Blogs, and more"
        />
        <meta name="twitter:image" content="/og-image.png" />
      </Head>

      <div className={styles.container}>
        {/* APP MARKUP STARTS FROM HERE */}
        <main className={styles.main}>
          {/* HEADER */}
          <h1 className={styles.title}>
            <img src="/favicon.svg" />
            Covercons
          </h1>

          {/* COVER PREVIEW ON TOP FOR SMALLER DEVICES */}
          {width < 790 && (
            <div className={styles.mobilePreviewBoxWrapper}>
              <div className={styles.mobilePreviewBox}>
                <div
                  className={styles.previewSvg}
                  dangerouslySetInnerHTML={{ __html: generatedCoverSvg }}
                />
              </div>
            </div>
          )}

          <div className={styles.wrapper}>
            {/* SETTINGS PANEL SELECTION */}
            <div className={styles.modifierSettings}>
              {/* STEP 1 : ASK USER TO SEARCH AND SELECT AN ICON */}
              <IconSearch
                setSelectedIconName={setSelectedIconName}
                setSelectedIconVersion={setSelectedIconVersion}
              />
              {/* STEP 2 : ASK USER TO SELECT ICON TYPE (outline/filled/two-shade) */}
              <div className={styles.iconTypeSetting}>
                <h2 htmlFor="icon_name">Select the icon type</h2>
                <select
                  type="text"
                  onChange={(e) => setSelectedIconType(e.target.value)}
                >
                  <option value="materialicons">Filled (default)</option>
                  <option value="materialiconstwotone">Two shade</option>
                  <option value="materialiconsoutlined">Outline</option>
                  <option value="materialiconsround">Rounded</option>
                </select>
              </div>
              {/* STEP 3 : ASK USER TO SELECT THE COVER DESIGN TYPE */}
              <div className={styles.iconTypeSetting}>
                <h2 htmlFor="icon_name">Select the Cover Design</h2>
                <select
                  type="text"
                  value={coverType}
                  onChange={(e) => {
                    setCoverType(e.target.value);
                    setShowAdvancedSettings(false);
                  }}
                >
                  <option value="singlemiddleicon">Single Icon</option>
                  <option value="iconpattern">Icon Pattern</option>
                  <option value="noicon">No Icon</option>
                </select>

                {/* ADVANCED SETTINGS FOR ICON PATTERN*/}
                <AnimatePresence>
                  {coverType == "iconpattern" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ opacity: 0 }}
                      className={styles.advancedSettingsBtn}
                    >
                      <p>Show Advanced Settings</p>
                      <label className="switch">
                        <input
                          type="checkbox"
                          defaultChecked={showAdvancedSettings}
                          onChange={(e) => {
                            setShowAdvancedSettings(e.target.checked);
                          }}
                        />
                        <span className="slider round"></span>
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {coverType == "iconpattern" && showAdvancedSettings && (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.2,
                        },
                      },
                      exit: {
                        opacity: 0,
                      },
                    }}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    {/* STEP 3.1 : SPACING BETWEEN ICONS */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1 },
                      }}
                      className={styles.iconPatternSetting}
                    >
                      <h2>Select Spacing between Icons</h2>
                      <div className={styles.iconPaternSettingDisplayValue}>
                        Spacing: {iconPatternSpacing}{" "}
                        <span
                          className={styles.defaultChanger}
                          onClick={() => setIconPatternSpacing(25)}
                        >
                          {"("}default 25{")"}
                        </span>
                      </div>
                      <input
                        type="range"
                        name="icon_spacing"
                        value={iconPatternSpacing}
                        min="20"
                        max="80"
                        onChange={(e) => setIconPatternSpacing(e.target.value)}
                      ></input>
                    </motion.div>
                    {/* STEP 3.2 : ICON SIZE IN PATTERN */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1 },
                      }}
                      className={styles.iconPatternSetting}
                    >
                      <h2>Select Icons size in Pattern</h2>
                      <div className={styles.iconPaternSettingDisplayValue}>
                        Icon Size: {iconPatternSize}{" "}
                        <span
                          className={styles.defaultChanger}
                          onClick={() => setIconPatternSize(2)}
                        >
                          {"("}default 2{")"}
                        </span>
                      </div>
                      <input
                        type="range"
                        name="icon_size"
                        value={iconPatternSize}
                        min="1"
                        max="30"
                        onChange={(e) => setIconPatternSize(e.target.value)}
                      ></input>
                    </motion.div>
                    {/* STEP 3.3 : PATTERN ROTATION */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1 },
                      }}
                      className={styles.iconPatternSetting}
                    >
                      <h2>Select Rotation in Pattern</h2>
                      <div className={styles.iconPaternSettingDisplayValue}>
                        Rotation : {iconPatternRotation}{" "}
                        <span
                          className={styles.defaultChanger}
                          onClick={() => setIconPatternRotation(330)}
                        >
                          {"("}default 330{")"}
                        </span>
                      </div>
                      <input
                        type="range"
                        name="icon_size"
                        value={iconPatternRotation}
                        min="0"
                        max="360"
                        onChange={(e) => setIconPatternRotation(e.target.value)}
                      ></input>
                    </motion.div>{" "}
                    {/* STEP 3.4 : ICON SHADE IN PATTER (dark / light) */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1 },
                      }}
                      className={styles.iconPatternSetting}
                    >
                      <h2>Select icon shade in Pattern</h2>
                      <select
                        type="text"
                        onChange={(e) => setIconPatternShade(e.target.value)}
                      >
                        <option value={-25}>Dark (default)</option>
                        <option value={28}>Light</option>
                      </select>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* STEP 4 : ASK USER TO SELECT THE COVER COLOR */}
              <div className={styles.modifierSettings__colorSelect}>
                <h2>Select background color</h2>
                <div className={styles.colorSelect__picker}>
                  <div className={styles.inner}>
                    <GradientPicker
                      {...{
                        minStops: 1,
                        maxStops: 5,
                        paletteHeight: 32,
                        palette,
                        onPaletteChange: setPalette,
                      }}
                    >
                      <WrappedChromePicker />
                    </GradientPicker>
                    <div className={styles.angle_holder}>
                      <AnglePicker
                        angle={angle}
                        setAngle={setAngle}
                        size={32}
                      />
                      <div className={styles.angle_inputs}>
                        <span onClick={() => onAngleInputChange(angle - 1)}>
                          &#8722;
                        </span>
                        <input value={`${angle}°`} disabled />
                        <span onClick={() => onAngleInputChange(angle + 1)}>
                          &#43;
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className={styles.notionColours}>Notion Colors</p>
                  <CirclePicker
                    onChangeComplete={(color) =>
                      setPalette([
                        {
                          color: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`,
                          offset: "1.000",
                          opacity: color.rgb.a,
                        },
                      ])
                    }
                    className={styles.circlePicker}
                    colors={[
                      "#9B9A97",
                      "#64473A",
                      "#D9730D",
                      "#DFAB01",
                      "#0F7B6C",
                      "#0B6E99",
                      "#6940A5",
                      "#AD1A72",
                      "#E03E3E",
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* COVER PREVIEW IN THE RIGHT SIDE FOR LARGE SCREENS */}
            <div className={styles.coverPreview}>
              <div className={styles.previewBox}>
                <h2>
                  <span className={styles.previewBoxTitle}>
                    🟢 &nbsp;Live Preview
                  </span>
                </h2>
                <div
                  className={styles.previewSvg}
                  dangerouslySetInnerHTML={{ __html: generatedCoverSvg }}
                />
              </div>

              {/* DOWNLOAD BUTTONS FOR COVER IMAGES */}
              <a ref={downloadHelper_a_tag}></a>
              <div className={styles.downloadBtnWraper}>
                <button
                  className={styles.downloadBtn}
                  onClick={handleDownloadSvg}
                >
                  <img
                    src="/assets/notion-logo.svg"
                    alt="download icon"
                    width={20}
                  />
                  Download SVG
                </button>
                <button
                  className={styles.downloadBtn}
                  onClick={handleDownloadPng}
                >
                  <img
                    src="/assets/image-logo.svg"
                    alt="download icon"
                    width={20}
                  />
                  Download PNG
                </button>
              </div>
            </div>
          </div>

          {/* FOOTER AND CREDITS */}
          <footer className={styles.footer}>
            <p>
              Made By <a href="https://srujangurram.me"> Srujan</a>
            </p>
          </footer>
        </main>
      </div>
      {/* BUY ME A COFFEE WIDGET FOR DONATIONS */}
      <script
        data-name="BMC-Widget"
        data-cfasync="false"
        src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
        data-id="srujangurram"
        data-description="Support me on Buy me a coffee!"
        data-message="If you like this tool you can offer me a coffee 😋"
        data-color="#ff4c29"
        data-position="Right"
        data-x_margin="18"
        data-y_margin="18"
      ></script>
    </>
  );
}
