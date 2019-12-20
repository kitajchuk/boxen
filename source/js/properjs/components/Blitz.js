import * as core from "../core";
import Blit from "properjs-blit";



class Blitz {
    constructor ( element, data ) {
        this.element = element;
        this.data = data;
        this.seq = data.seq;
        this.total = Number( data.len );
        this.fps = Number( data.fps );
        this.blit = new Blit({
            paused: true,
            fps: this.fps
        });

        this.make();
        this.bind();
        this.load().then(() => {
            this.wait();
        });
    }


    wait () {
        this.blit.blit(( f ) => {
            this.element[ 0 ].scrollLeft = window.innerWidth * ( f % this.total );
            // console.log( "FPS:", (f % this.fps), "PNG", (f % this.total) );
        });

        // Fire away!!!
        this.onScroll();
    }


    load () {
        let idx = 0;

        return new Promise(( resolve ) => {
            const _load = () => {
                const image = new Image();

                image.className = "image";
                image.src = this.assets[ idx ];
                image.onload = () => {
                    idx++;
                    this.aspect.appendChild( image );

                    if ( idx === this.total ) {
                        this.element.append( this.aspect );
                        resolve();

                    } else {
                        _load();
                    }
                };
            };

            _load();
        });
    }


    bind () {
        this._onScroll = this.onScroll.bind( this );

        core.emitter.on( "app--scroll", this._onScroll );
    }


    make () {
        this.assets = [];
        this.aspect = document.createElement( "div" );

        for ( let i = 1; i <= this.total; i++ ) {
            let idx = i;

            if ( idx < 10 ) {
                idx = `0${idx}`;
            }

            this.assets.push( `/assets/img/${this.seq}/${this.seq}_${idx}.png` );


        }
    }


    onScroll () {
        if ( core.util.isElementVisible( this.element[ 0 ] ) ) {
            this.blit.start().play();

        } else {
            this.blit.pause();
        }
    }


    destroy () {
        if ( this._onScroll ) {
            core.emitter.off( "app--scroll", this._onScroll );
            this._onScroll = null;
        }
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Blitz;
