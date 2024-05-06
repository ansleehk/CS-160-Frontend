import React from "react";
import "./Privacy.css";

const Privacy = ({ onClose }) => {

  return (
    <div id="privacy-popup-overlay">
      <div id="privacy-popup">

        {/* Close button */}
        <button id="close-button" onClick={onClose}>x</button>

        {/* Title */}
        <h2 id="title">Privacy Policy</h2>

        {/* Content */}
        <div id="policy">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur turpis quam, mollis in neque rhoncus, sodales tincidunt leo. Vivamus mattis congue volutpat. Integer quis euismod mi. Integer pharetra congue urna, in dignissim mauris aliquam non. Nulla et nibh in mauris facilisis posuere non ac erat. Vestibulum ligula tortor, tristique luctus est non, suscipit dignissim enim. Mauris tempus est lectus, ut congue metus tincidunt at. Mauris tincidunt magna non justo egestas, et facilisis tortor sollicitudin. Suspendisse potenti. Morbi laoreet erat vitae neque condimentum, id faucibus sapien dictum. Pellentesque ac aliquet lectus, id vehicula neque. Pellentesque odio odio, lobortis eget ex eget, tristique lacinia risus. Donec vel neque at ipsum dictum pulvinar. Nullam sed feugiat orci. Mauris a ligula sed urna venenatis ornare vel in velit. Nam cursus efficitur tempus.</p>

          <p>Donec tristique scelerisque erat, ultricies varius sem congue ut. Vestibulum eu lacus volutpat, mattis lectus eu, vestibulum lacus. Maecenas tincidunt tellus quis purus suscipit, non elementum purus pellentesque. Nulla facilisi. Integer tincidunt sem nec nisi blandit aliquet. Nulla facilisi. Maecenas a massa sed nulla sagittis aliquam at aliquet ipsum.</p>

          <p>In tempus scelerisque ante at euismod. Nullam luctus euismod feugiat. Ut vel est dignissim, aliquam odio quis, hendrerit erat. Vivamus iaculis egestas iaculis. Vestibulum hendrerit sed lorem ut accumsan. Donec sed diam venenatis est tempor consequat eleifend a libero. Curabitur consectetur dapibus lorem laoreet tristique. Aliquam lectus justo, congue ac neque eu, elementum placerat dui.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
