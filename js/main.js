$( document ).ready(() => {
    
    $("#show-image").on('click', function(e) {
        const target = $(e.target);
        if (!target.closest('.show-image__prew-image').length && !target.closest('video').length && !target.closest('.show-image__next-image').length) {
            $(this).removeClass("show-image");
            $('body').removeClass("overflow");
            setTimeout(() => {
                $(this).find('img').remove();
                $(this).find('video').remove();
            }, 300);
        }
    })

    const animateNextImage = (el, className) => {
        $(el).addClass(`${className}`);
        setTimeout(() => {
            $(el).removeClass(`${className}`);
        }, 50);
    }

    const animatePrewImage = (unit, type) => {
        let animatedImage = $("#show-image").find(`${type}`);
        animatedImage.each((id, item) => {
            $(item).css('transform', `translateX(${unit}vw)`);
            $(item).css('opacity', `0`);
            setTimeout(() => {
                $(item).remove();
            }, 300);
        })
    }

    const addContolsVideo = (el) => {
        if (el.prop("tagName").toLowerCase() == 'video')
        el.attr('controls', true);
    }

    const openImage = (id) => {
        let openedImage;
        if ($(id).prop("tagName").toLowerCase() == 'section') {
            openedImage = $($(id).find('video')).clone().appendTo("#show-image");
        } else {
            openedImage = $(id).clone().appendTo("#show-image");
        }
        addContolsVideo(openedImage);
        return openedImage;
    }

    const prewImage = (id, image) => {
        let type = $(image[id]).prop("tagName").toLowerCase();
        if (type == "section") {
            type = 'video';
        }
        animatePrewImage('100', type);
        if (id > 0) {
            let openedImage = openImage(image[id-1]);
            animateNextImage(openedImage, "left-animate");
            id--;
        } else if (id == 0) {
            let openedImage = openImage(image[image.length - 1]);
            animateNextImage(openedImage, "left-animate");
            id = image.length - 1;
        }
        return id;
    }
    const nextImage = (id, image) => {
        let type = $(image[id]).prop("tagName").toLowerCase();
        if (type == "section")
        type = 'video';
        animatePrewImage('-100', type);
        if (id < image.length - 1) {
            let openedImage = openImage(image[id+1]);
            animateNextImage(openedImage, 'right-animate');
            id++;
        } else if (id == image.length - 1) {
            let openedImage = openImage(image[0]);
            animateNextImage(openedImage, 'right-animate');
            id = 0;
        }
        return id;
    }

    const listImages = $(".content-viewer__images--list");
    const imageInList = listImages.children();
    const imageDesktop = [];
    imageDesktop.push($(".content-viewer__images").find($(".content-viewer__images").find('> img').length > 0 ? '> img' : '> section'));
    
    $(".content-viewer__images--list").children().each((id, item) => {
        imageDesktop.push(item);
    })

    const imageMobile = $(".content-viewer__images--mobile").children('');
    const images = $(listImages).parent();

    const eachImages = (image) => { 
        image.each((id, item) => { 
            $(item).on('click', ()  => { 
                let initialPoint; 
                let finalPoint; 
                $('#show-image').addClass("show-image");
                openImage($(item));
                $('body').addClass("overflow");
                $('#show-image').off('touchstart').on('touchstart', function(e) { 
                    initialPoint = e.originalEvent.changedTouches[0]; 
                }); 
                $('#show-image').off('touchend').on('touchend', function(e) { 
                    finalPoint = e.originalEvent.changedTouches[0];
                    let xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX); 
                    let yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
                    if (xAbs > 20 || yAbs > 150) { 
                        if (yAbs > xAbs) {
                            if (finalPoint.pageY > initialPoint.pageY) {
                                $(this).removeClass("show-image");
                                $('body').removeClass("overflow");
                                setTimeout(() => {
                                    $(this).find('img').remove();
                                    $(this).find('video').remove();
                                }, 300);
                            }
                        } else
                        id = finalPoint.pageX < initialPoint.pageX ? nextImage(id, image) : prewImage(id, image);
                    } 
                }) 
                $(document).off('keydown').on('keydown', function(e) { 
                    if (e.key  == 'ArrowLeft')
                    id = prewImage(id, image); 
                    if (e.key  == 'ArrowRight') 
                    id = nextImage(id, image); 
                }) 
                $(".show-image__prew-image").off('click').on('click', () => { 
                    id = prewImage(id, image); 
                }) 
                $(".show-image__next-image").off('click').on('click', () => { 
                    id = nextImage(id, image); 
                }) 
            }) 
        }) 
    }

    images.on('click', () => {
        eachImages($(imageDesktop));
        eachImages(imageMobile);
    })

    const countImages = () => {
        if (imageInList.length == 0) {
            images.addClass("none-list");
            $(listImages).remove();
        }
        if (imageInList.length > 3)
        $(listImages).addClass("max-images");
        if (imageInList.length > 4) {
            $(imageInList).each((id, item) => {
                if (id == 3) {
                    $(item).wrap("<div class='plus-images'></div>");
                    $(".plus-images").append(`<p>+${imageInList.length - 4}</p>`);
                }
                if (id > 3)
                $(item).hide();
            })
        }
        if (images.children().length == 0) 
        images.remove();
    }

    $('.content-viewer__images--mobile').slick({
        infinite: true,
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: true,
        arrows: false,
    });

    eachImages($(imageDesktop));
    eachImages(imageMobile);
    countImages();
})
