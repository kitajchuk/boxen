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

        this.bind();
        this.make();
        this.load().then(() => {
            this.wait();
        });
    }


    wait () {
        this.blit.blit(( f ) => {
            this.draw( f );
        });

        // Fire away!!!
        this.onScroll();
    }


    /*
    ctx.drawImage(
        img/cvs,
        mask-x,
        mask-y,
        mask-width,
        mask-height,
        x-position,
        y-position,
        width,
        height
    )
    */
    draw ( f ) {
        // const fps = (f % this.fps);
        const png = (f % this.total);

        // console.log( "FPS:", fps, "PNG", png );

        this.clear();
        this.context.drawImage(
            this.images[ png ],
            0,
            0,
            this.canvas.width,
            this.canvas.height,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }


    clear () {
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }


    load () {
        let idx = 0;

        core.dom.html.addClass( "is-loader" );

        return new Promise(( resolve ) => {
            const _load = () => {
                const image = new Image();

                image.className = "image";
                image.src = this.assets[ idx ];
                image.onload = () => {
                    idx++;

                    this.loading.innerHTML = `<p>Sequencing <em>${idx}</em> of <em>${this.total}</em> PNGs</p>`;

                    if ( idx === this.total ) {
                        core.dom.html.removeClass( "is-loader" );
                        resolve();

                    } else {
                        _load();
                    }
                };

                this.images[ idx ] = image;
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
        this.images = [];
        this.canvas = document.createElement( "canvas" );
        this.context = this.canvas.getContext( "2d" );
        this.canvas.width = "1920";
        this.canvas.height = "1080";
        this.loading = document.createElement( "span" );
        this.loading.innerHTML = `<p>Sequencing ${this.total} PNGs</p>`;
        this.element.append( this.loading );
        this.element.append( this.canvas );

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
