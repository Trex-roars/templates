'use client'


export default function Home() {
    return (
        <>
            <div id="heroImage">
                <img
                    src="https://i.pinimg.com/736x/c0/f1/18/c0f118f50f63ff81b75074ca9640d3b7.jpg"
                    alt=""
                />

                <div id="heroContent">
                    <nav>
                        <h1>
                            CART <i className="ri-arrow-right-up-line"></i>
                        </h1>

                        <div>
                            <a href="">Shop</a>
                            <a href="">About Us</a>
                            <a href="">Car Feature</a>
                            <a href="">Electric Car</a>
                        </div>
                    </nav>

                    <div id="heroText">
                        <h1>Drive the Future with Electric Car</h1>

                        <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor vel
                            eveniet iure maiores. Iste cum commodi tempora laborum consectetur
                            dolor eius dignissimos quidem magni ut!
                        </p>

                        <button>Learn More</button>
                    </div>
                </div>
            </div>

            <div id="rightDiv">
                <div>
                    <div id="buttonDiv">
                        <button>Get in touch</button>
                    </div>
                    <div id="carImage2">
                        <div>
                            <img
                                src="https://i.pinimg.com/736x/09/b7/c4/09b7c407c0dfdda223b881a4494bcac6.jpg"
                                alt=""
                            />
                        </div>

                        <a href="">Handle tough and rough terrains</a>
                    </div>
                </div>

                <div id="carImage3">
                    <img
                        src="https://i.pinimg.com/736x/b9/3a/c9/b93ac9215de4c00d600223b52e6cf424.jpg"
                        alt=""
                    />
                </div>
            </div>

            <div id="leftDiv">
                <div id="topLeftText">
                    <h2>Lorem ipsum dolor sit amet, con</h2>
                    <span>Learn More</span>
                </div>
                <div>
                    <div></div>
                    <div id="bottomLeftDiv">
                        <div id="bottomLeft">
                            <h3>A Deep Dive into something</h3>
                            <p>
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim,
                                quibusdam quae veniam iusto asperiores repellendus at facere
                                pariatur impedit necessitatibus porro magnam magni maxime
                                veritatis quos, suscipit itaque laborum voluptates.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        *,
        html {
          box-sizing: border-box;
          padding: 0;
          margin: 0;
        }

        body {
          width: 100vw;
          height: 100vh;
          padding: 2vw 2vw 9vw 12vw;
        }

        #heroImage {
          width: 100%;
          height: 100%;
          border-radius: 4vw;
          overflow: hidden;
          position: relative;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        a {
          color: white;
          text-decoration: none;
        }

        #heroContent {
          color: white;
          position: absolute;
          top: 2vw;
          left: 3vw;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 30vw;
        }

        nav {
          display: flex;
          align-items: center;
          gap: 4vw;
        }

        nav div {
          display: flex;
          gap: 1vw;
        }

        nav div a {
          background-color: rgba(0, 0, 0, 0.242);
          padding: 0.5vw 1vw;
          border-radius: 2vw;
          backdrop-filter: blur(5px);
        }

        #heroText {
          display: flex;
          flex-direction: column;
          width: 30vw;
          gap: 2vw;
        }

        #heroText h1 {
          font-size: 4vw;
          font-weight: bold;
        }

        #heroText button {
          background-color: rgb(222, 121, 49);
        }

        button {
          width: fit-content;
          border-radius: 2vw;
          padding: 0.7vw 1.2vw;
        }

        #rightDiv {
          display: flex;
          height: 100vh;
          flex-direction: column;
          justify-content: space-between;
          align-items: end;
          position: absolute;
          top: 0;
          right: 0;
        }

        #carImage2 {
          width: 12vw;
          height: 15vw;
          padding: 0.2vw;
          background-color: rgba(255, 255, 255, 0.264);
          border-radius: 2vw;
          backdrop-filter: blur(5px);
          overflow: hidden;
        }

        #carImage2 a {
          margin-top: 1vw;
        }

        #carImage2 div {
          border-radius: 2vw;
          height: 10vw;
          margin-bottom: 1vw;
          overflow: hidden;
        }

        #carImage3 {
          width: 18vw;
          height: 18vw;
          aspect-ratio: 1;
          padding: 1vw;
          background-color: white;
          border-radius: 3vw;
        }

        #carImage3 img {
          border-radius: 3vw;
        }

        #buttonDiv {
          background-color: white;
          padding: 1vw;
          border-radius: 2vw;
          width: 16vw;
          position: relative;
        }

        #leftDiv {
          display: flex;
          padding: 2vw 0;
          flex-direction: column;
          justify-content: space-between;
          position: absolute;
          top: 0;
          left: 2vw;
          height: 100vh;
          width: 9vw;
        }

        #bottomLeft {
          width: 30vw;
          gap: 2vw;
          display: flex;
          flex-direction: column;
        }

        #bottomLeft {
          width: 100%;
          gap: 1vw;
          display: flex;
          flex-direction: column;
          background-color: rgb(243, 235, 235);
          height: 10vw;
          border-radius: 2vw;
          overflow: hidden;
        }

        #bottomLeftDiv {
          width: 25vw;
          padding: 1vw;
          background-color: rgb(255, 255, 255);
          border-radius: 2vw;
        }

        #bottomLeft div {
          width: 100%;
          height: 7vw;
        }

        #topLeftText h2 {
          font-size: 1.5vw;
          font-weight: bold;
        }

        #bottomLeft h3 {
          font-size: 1.2vw;
          font-weight: bold;
        }

        #bottomLeft p {
          font-size: 1vw;
          color: rgba(0, 0, 0, 0.25);
        }

        #buttonDiv::after {
          content: " ";
          position: absolute;
          width: 4vw;
          height: 4vw;
          top: 4.7vw;
          right: 2vw;
          z-index: 10;
          background-image: radial-gradient(
            circle at 100% 100%,
            transparent 4vw,
            white 2vw
          );
          rotate: 90deg;
        }
      `}</style>
        </>
    );
}
