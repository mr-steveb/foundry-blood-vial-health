# 🩸 Blood Vial Health Bars

Gothic blood vial health bars for Foundry VTT D&D 5e campaigns, perfect for **Curse of Strahd** and other dark fantasy adventures.

[![Foundry VTT](https://img.shields.io/badge/Foundry%20VTT-11%2B-green)](https://foundryvtt.com/)
[![D&D 5e](https://img.shields.io/badge/D%26D%205e-Compatible-red)](https://foundryvtt.com/packages/dnd5e)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue)](https://github.com/mr-steveb/foundry-blood-vial-health/releases)

## ✨ Features

- **🧛 Gothic Aesthetic**: Perfect for horror and dark fantasy campaigns
- **🌊 Liquid Animation**: Realistic blood flow with wavy surface effects
- **🫧 Animated Bubbles**: Rising bubbles for authentic liquid movement
- **❤️ Health States**: Color-coded blood that changes based on HP percentage
- **⚡ Critical Pulsing**: Dramatic red glow when near death
- **🎯 D&D 5e Integration**: Seamless integration with D&D 5e health system
- **⚙️ Configurable**: Toggle bubbles and choose where to display vials

## 🎬 Preview

![Blood Vial Demo](preview.html)

### Health States

| Health % | Color | Effect |
|----------|-------|--------|
| 100% | 🩷 Bright Crimson | Full health glow |
| 75% | ❤️ Deep Red | Healthy blood flow |
| 50% | 🔴 Dark Red | Wounded appearance |
| 25% | 🆘 Critical Red | **Pulsing danger effect** |
| 5% | ⚫ Near Black | Near-death darkness |

## 🚀 Installation

### Method 1: Manual Installation
1. Download the [latest release](https://github.com/mr-steveb/foundry-blood-vial-health/releases)
2. Extract to `Data/modules/foundry-blood-vial-health/`
3. Restart Foundry VTT
4. Enable **Blood Vial Health Bars** in Module Management

### Method 2: Module Browser (Coming Soon)
*This module will be submitted to the Foundry package system once testing is complete.*

## ⚙️ Configuration

Access settings in **Game Settings → Module Settings → Blood Vial Health Bars**:

- **🎭 Enable for Tokens**: Replace token health bars with blood vials
- **📄 Enable for Actor Sheets**: Add blood vials to character sheets  
- **🫧 Enable Blood Bubbles**: Show animated bubbles in the vials

## 🎮 Compatibility

- **Foundry VTT**: v11+ (tested up to v12)
- **Game System**: D&D 5e only
- **Browsers**: Chrome, Firefox, Safari, Edge

## 🛠️ Technical Features

### Smart Integration
- **Non-destructive**: Replaces health bars without breaking existing functionality
- **Real-time updates**: Health changes instantly reflect in blood vials
- **Error handling**: Graceful fallbacks for missing data
- **Performance optimized**: Lightweight CSS animations

### Developer Features
- **Hot reload support**: For module development
- **Comprehensive logging**: Debug-friendly console output
- **Modular design**: Easy to extend and customize

## 🎨 Customization

The blood vials use CSS animations and can be customized by editing `styles/blood-vial.css`:

```css
/* Customize blood colors */
.blood-liquid.healthy {
    background: linear-gradient(90deg, #8B0000, #DC143C, #FF1493);
}

/* Adjust bubble behavior */
.blood-bubble {
    animation-duration: 3s; /* Speed up/slow down bubbles */
}

/* Modify vial size */
.blood-vial-container {
    width: 150px; /* Make wider */
    height: 25px; /* Make taller */
}
```

## 🎭 Perfect For

- **🧛 Curse of Strahd** campaigns
- **🏰 Gothic horror** adventures  
- **🌙 Dark fantasy** settings
- **💀 Halloween** one-shots
- **🗡️ Grimdark** campaigns

## 🔧 Troubleshooting

### Blood vials not appearing?
1. Ensure you're using **D&D 5e system**
2. Check that the module is **enabled**
3. Verify **token health bars** are visible
4. Try **refreshing** the page

### Performance issues?
- Disable bubbles in module settings
- Reduce number of tokens on screen
- Check browser hardware acceleration

### Still having issues?
- Check browser console for errors
- Report bugs on [GitHub Issues](https://github.com/mr-steveb/foundry-blood-vial-health/issues)

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the gothic atmosphere of **Curse of Strahd**
- CSS liquid animations inspired by [Chris Gannon's temperature slider](https://codepen.io/chrisgannon/pen/vjNNew)
- Built for the amazing **Foundry VTT** community

---

**🩸 May your blood always flow... until it doesn't. 🩸**

*Perfect for when you want your players to feel the dread as their life essence literally drains away...*

## 📊 Changelog

### v1.0.0 (Current)
- ✨ Initial release
- 🎨 Gothic blood vial health bars
- 🌊 Liquid animation effects  
- 🫧 Animated bubbles
- ⚙️ Configurable settings
- 🎯 D&D 5e integration

---

<div align="center">

**Made with ❤️ (and 🩸) for the Foundry VTT community**

[⭐ Star this repo](https://github.com/mr-steveb/foundry-blood-vial-health) | [🐛 Report Bug](https://github.com/mr-steveb/foundry-blood-vial-health/issues) | [💡 Request Feature](https://github.com/mr-steveb/foundry-blood-vial-health/issues)

</div>
