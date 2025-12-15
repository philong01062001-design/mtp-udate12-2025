
<template>
    <div class="mtpe-video">
        <canvas ref="main" />
    </div>
</template>

<script>
import * as PIXI from "pixi.js";
// import { GlitchFilter } from '@pixi/filter-glitch';

import $ from "jquery";

export default {
    props: [
        'src',
        'animation',
        'animationCount',
        'cursorEffect',
        'loop',
        'forceAnimation',
        'animationSpeed'
    ],

    data() {
        return {
            loaded: false,
            app: null,
            width: 0,
            height: 0,
            isVid: this.forceAnimation !== true && ($(window).width() > 800 || !this.animation || !this.animationCount)
        };
    },

    mounted() {
        if (this.isVid) {
            this.$nextTick(()=> this.init());
        } else {
            var frames = [ ];
            for (var i = 0; i < this.animationCount; i++) {
                if (i < 10) i = '0'+ i;
                frames.push(this.animation.replace('$', i));
            }

            const loader = new PIXI.Loader();

            loader
                .add(this.frames = frames)
                .load(this.init);
        }
    },

    beforeDestroy() {
        if (this.app) {
            this.app.stop();
            this.app.destroy();
        }
        this.loaded = false;
    },

    methods: {
        init() {
            var app = (this.app = new PIXI.Application({
                transparent: true,
                view: this.$refs.main,
                resizeTo: this.$refs.main,
                antialias: false,
                // forceCanvas: true,
            }));

            this.loaded = true;
            this.resize();

            var radius = 40;
            var blurSize = 10;

            var circle = new PIXI.Graphics()
                .lineStyle(0)
                .beginFill(0xFF0000)
                .drawCircle(radius + blurSize, radius + blurSize, radius)
                .endFill();

            circle.filters = [new PIXI.filters.BlurFilter(blurSize)];

            const bounds = new PIXI.Rectangle(0, 0, (radius + blurSize) * 2, (radius + blurSize) * 2);
            const texture = app.renderer.generateTexture(circle, PIXI.SCALE_MODES.NEAREST, 1, bounds);
            const focus = new PIXI.Sprite(texture);

            var vidTexture;

            if (this.isVid) {
                var video = document.createElement("video");
                video.preload = "auto";
                video.autoplay = 'autoplay';
                video.loop = !!this.loop;              // enable looping
                video.muted = true;
                video.src = this.src;
                video.onended = ()=> this.$emit("ended");
    
                vidTexture = PIXI.Texture.from(video);
            } else {
                vidTexture = this.frames;
            }

            var backg = this.isVid? 
                new PIXI.Sprite(vidTexture): 
                new PIXI.AnimatedSprite.fromFrames(vidTexture);

            var matrix = this.createMatixTileSprite(app.screen.width, app.screen.height);
            matrix.alpha = 0.5;

            var foreg = this.isVid? 
                new PIXI.Sprite(vidTexture): 
                new PIXI.AnimatedSprite.fromFrames(vidTexture);
            // foreg.tint = 0xddfeff;

            var container = new PIXI.Container();
            container.addChild(foreg);
            container.addChild(matrix);

            app.stage.addChild(backg);
            app.stage.addChild(container);
            app.stage.addChild(focus);

            container.mask = focus;
            container.visible = false;
            
            var disp = PIXI.Sprite.from('/static/disp5.jpg');
            var dispFilter = new PIXI.filters.DisplacementFilter(disp);
            disp.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
            dispFilter.padding = 10;

            foreg.filters = [ 
                dispFilter,
            ];
            
            app.stage.interactive = true;

            var cpos = null;
            var count = 1;

            foreg.width = backg.width = $(this.$el).width();
            foreg.height = backg.height = $(this.$el).height();
            this.app.renderer.resize(backg.width, backg.height);

            if (this.cursorEffect === true || this.cursorEffect === undefined) {
                app.stage.on('mousemove', (event) => {
                    count = Math.min(count + 0.2, 3);
                    cpos = { x: event.data.global.x, y: event.data.global.y };
                });

                app.stage.on('mouseout', ()=> cpos = null);

                app.ticker.add((delta)=> {
                    if (!cpos) return container.visible = false;

                    container.visible = true;

                    foreg.width = backg.width = $(this.$el).width();
                    foreg.height = backg.height = $(this.$el).height();
                    this.app.renderer.resize(backg.width, backg.height);

                    // console.log(backg.width, backg.height);

                    focus.scale.set(count);

                    focus.position.x = cpos.x - focus.width / 2;
                    focus.position.y = cpos.y - focus.height / 2;

                    count = Math.max(1, count / 1.05);
                });
            }

            if (!this.isVid) {
                backg.play();
                backg.loop = !!this.loop;
                backg.animationSpeed = this.animationSpeed || 0.3;
                backg.onComplete = ()=> this.$emit('ended');
            }
        }, 

        resize() {
            if (!this.loaded) return;

            if ($(this.$el).is(':visible')) {
                this.app.start();
            } else {
                // console.log('video stop');
                this.app.stop();
            }

            setTimeout(this.resize, 500);
        },

        createMatixTileSprite(width, height, tileSize=100) {
            var graph = new PIXI.Graphics();

            graph.lineStyle(1, 0xcccccc)
                .moveTo(0, 0)
                .lineTo(tileSize, tileSize)
                .moveTo(0, tileSize)
                .lineTo(tileSize, 0)

                .moveTo(tileSize, 0)
                .lineTo(tileSize, tileSize)
                .moveTo(0, tileSize)
                .lineTo(tileSize, tileSize);

            const bounds = new PIXI.Rectangle(0, 0, tileSize, tileSize);
            const texture = this.app.renderer.generateTexture(graph, PIXI.SCALE_MODES.NEAREST, 1, bounds);

            return new PIXI.TilingSprite(
                texture,
                width,
                height,
            );
        },
    },
};
</script>

<style scoped>
canvas {
    position: relative;
    widows: 100%;
    height: 100%;
}
</style>



// WEBPACK FOOTER //
// src/components/MTPEVideo.vue